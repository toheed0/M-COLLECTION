import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("userToken");
      
      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching order details for:", id);
      console.log("🔑 Token exists:", !!token);

      // ✅ Try orders endpoint first
      let response;
      try {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: false // ✅ Important: Disable credentials for CORS
          }
        );
        console.log("✅ Order found via orders API");
      } catch (orderError) {
        // ✅ If orders endpoint fails, try checkout endpoint
        console.log("🔄 Trying checkout endpoint...");
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: false // ✅ Important: Disable credentials
          }
        );
        console.log("✅ Data found via checkout API");
      }

      setOrder(response.data);
      
    } catch (err) {
      console.error("❌ Error fetching order details:", err);
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Order</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchOrderDetail}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/my-orders")}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/my-orders")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine if it's an order or checkout
  const isOrder = order.orderItems !== undefined;
  const items = isOrder ? order.orderItems : order.checkoutItems;
  const totalPrice = order.totalPrice;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <div className="text-sm text-gray-500">
            {isOrder ? 'Order' : 'Checkout'} Details
          </div>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Package size={24} />
              <h1 className="text-2xl font-bold">
                {isOrder ? 'Order' : 'Checkout'} #{order._id?.toString().substring(18)}
              </h1>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="opacity-80">Placed on:</span>
                <span className="ml-2">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="opacity-80">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  order.isPaid ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.paidAt && (
                <div>
                  <span className="opacity-80">Paid on:</span>
                  <span className="ml-2">{new Date(order.paidAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Section */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package size={20} />
              Order Items
            </h2>
            <div className="space-y-4">
              {items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.color && `Color: ${item.color} • `}
                      {item.size && `Size: ${item.size} • `}
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">Rs {item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rs {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Truck size={20} />
                Shipping Address
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{order.shippingAddress.address}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              Payment Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs {totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Rs 0.00</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                <span>Total:</span>
                <span>Rs {totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;