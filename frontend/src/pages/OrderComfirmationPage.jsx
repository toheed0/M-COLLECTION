import React, { useEffect, useState } from "react";
import { CheckCircle, Truck } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const OrderConfirmationPage = () => {
  const { checkoutId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order details.");
        setLoading(false);
      }
    };

    if (checkoutId) fetchOrder();
  }, [checkoutId]);

  if (loading) return <p className="text-center py-10">Loading order...</p>;
  if (!order) return <p className="text-center py-10">Order not found!</p>;

  const totalPrice = order.checkoutItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const createdDate = new Date(order.createdAt);
  const deliveryStart = new Date(createdDate);
  const deliveryEnd = new Date(createdDate);
  deliveryStart.setDate(createdDate.getDate() + 3);
  deliveryEnd.setDate(createdDate.getDate() + 5);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Order ID: <span className="font-semibold">{order._id}</span>
          </p>
        </div>

        {/* Order Items */}
        <div className="border-t border-b py-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.color} | Size: {item.size}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-semibold text-gray-800">Rs {item.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{order.shippingAddress.address}</p>
            <p className="text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
          </div>

          {/* Estimated Delivery */}
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 mt-4 p-4 rounded-lg">
            <Truck className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-green-700 font-medium">Estimated Delivery:</p>
              <p className="text-sm text-green-600">{formatDate(deliveryStart)} – {formatDate(deliveryEnd)}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-semibold mb-6">
          <span>Total Amount</span>
          <span className="text-green-600">Rs {totalPrice}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:scale-[1.03] transition-transform duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
