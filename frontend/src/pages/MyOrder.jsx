import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrders } from "../slices/orderSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [checkouts, setCheckouts] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    loadAllOrders();
  }, [dispatch]);

  const loadAllOrders = async () => {
    await dispatch(fetchUserOrders());
    await fetchCheckouts();
  };

  // Fetch all checkouts
  const fetchCheckouts = async () => {
    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem("userToken");
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/user/checkouts`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCheckouts(response.data);
      setDebugInfo(`✅ Loaded ${response.data.length} checkouts`);
    } catch (error) {
      console.error("Checkout fetch error:", error);
      setCheckouts([]);
      setDebugInfo("❌ Failed to load checkouts");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Simple mark as paid (without creating order)
  const markCheckoutAsPaid = async (checkoutId) => {
    try {
      const token = localStorage.getItem("userToken");
      setDebugInfo("Marking checkout as paid...");
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/mark-paid-simple`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setDebugInfo("✅ Checkout marked as paid!");
      await loadAllOrders();
      
    } catch (error) {
      console.error("Manual payment failed:", error);
      setDebugInfo(`❌ Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Convert paid checkout to order
  const convertToOrder = async (checkoutId) => {
    try {
      const token = localStorage.getItem("userToken");
      setDebugInfo("Converting to order...");
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/convert-to-order`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setDebugInfo("✅ Converted to order successfully!");
      await loadAllOrders();
      
    } catch (error) {
      console.error("Conversion failed:", error);
      setDebugInfo(`❌ Conversion failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Create test order directly
  const createTestOrder = async () => {
    try {
      const token = localStorage.getItem("userToken");
      setDebugInfo("Creating test order...");
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/test/create`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setDebugInfo("✅ Test order created!");
      await loadAllOrders();
      
    } catch (error) {
      console.error("Test order failed:", error);
      setDebugInfo(`❌ Test order failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Filter checkouts
  const unpaidCheckouts = checkouts.filter(checkout => !checkout.isPaid);
  const paidUnfinalizedCheckouts = checkouts.filter(checkout => checkout.isPaid && !checkout.isFinalized);
  const finalizedCheckouts = checkouts.filter(checkout => checkout.isFinalized);

  // Combine orders and finalized checkouts
  const allOrders = [
    ...(orders || []),
    ...finalizedCheckouts.map(checkout => ({
      ...checkout,
      _id: checkout._id,
      orderItems: checkout.checkoutItems,
      type: 'from-checkout',
      createdAt: checkout.createdAt,
      totalPrice: checkout.totalPrice,
      isPaid: checkout.isPaid,
      shippingAddress: checkout.shippingAddress
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleRowClick = (id, type = 'order') => {
    if (type === 'order' || type === 'from-checkout') {
      navigate(`/order/${id}`);
    } else {
      navigate(`/checkout/${id}`);
    }
  };

  // Loading state
  if (loading || checkoutLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
        <div className="text-center mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
          <p className="text-sm text-gray-400 mt-2">{debugInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      {/* Debug Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-blue-800 font-medium">
              📊 Stats: {allOrders.length} Orders • {unpaidCheckouts.length} Unpaid • {paidUnfinalizedCheckouts.length} Ready to Convert
            </p>
            <p className="text-xs text-blue-600 mt-1">{debugInfo}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadAllOrders}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh
            </button>
            <button
              onClick={createTestOrder}
              className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Order
            </button>
          </div>
        </div>
      </div>

      {/* Unpaid Checkouts */}
      {unpaidCheckouts.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            ⏳ Pending Payment ({unpaidCheckouts.length})
          </h3>
          <div className="space-y-3">
            {unpaidCheckouts.slice(0, 3).map((checkout) => (
              <div key={checkout._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border gap-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Checkout #{checkout._id.toString().substring(18)}</p>
                  <p className="text-sm text-gray-600">
                    {checkout.checkoutItems?.length || 0} items • 
                    Rs {checkout.totalPrice?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(checkout.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markCheckoutAsPaid(checkout._id)}
                    className="text-sm bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                  >
                    Mark Paid
                  </button>
                  <button
                    onClick={() => navigate(`/checkout/${checkout._id}`)}
                    className="text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
            {unpaidCheckouts.length > 3 && (
              <p className="text-center text-sm text-yellow-700">
                + {unpaidCheckouts.length - 3} more pending checkouts
              </p>
            )}
          </div>
        </div>
      )}

      {/* Paid but Unfinalized Checkouts */}
      {paidUnfinalizedCheckouts.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800 mb-3">
            ✅ Paid - Ready to Convert ({paidUnfinalizedCheckouts.length})
          </h3>
          <div className="space-y-2">
            {paidUnfinalizedCheckouts.map((checkout) => (
              <div key={checkout._id} className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <p className="font-medium">Checkout #{checkout._id.toString().substring(18)}</p>
                  <p className="text-sm text-gray-600">
                    Paid on {new Date(checkout.paidAt).toLocaleDateString()} • 
                    Rs {checkout.totalPrice?.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => convertToOrder(checkout._id)}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  Convert to Order
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      )}

      {/* No Orders State */}
      {allOrders.length === 0 && !loading && (
        <div className="text-center mt-10">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Start Shopping
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      {allOrders.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Orders ({allOrders.length})</h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block relative shadow-md sm:rounded-lg overflow-hidden">
            <table className="min-w-full text-left text-gray-600">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="p-4 font-medium">
                      #{order._id?.toString().substring(18)}
                    </td>
                    <td className="p-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {order.orderItems?.length || order.checkoutItems?.length || 0} items
                    </td>
                    <td className="p-4 font-semibold">
                      Rs {order.totalPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleRowClick(order._id, order.type)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {allOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order #{order._id?.toString().substring(18)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">
                    {order.orderItems?.length || order.checkoutItems?.length || 0} items
                  </span>
                  <span className="font-semibold text-gray-800">
                    Rs {order.totalPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>

                <button
                  onClick={() => handleRowClick(order._id, order.type)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  View Order Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;