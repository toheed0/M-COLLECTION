import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createCheckout } from "../../slices/checkoutSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

// Stripe Payment Form Component
const StripeCheckoutForm = ({ amount, checkoutId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-payment-intent`,
          { amount }
        );
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        toast.error("Failed to initiate payment.");
      }
    };
    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      toast.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      toast.success("✅ Payment Successful!");
      navigate(`/order-confirmation/${checkoutId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded" />
      <button
        type="submit"
        disabled={!stripe || !clientSecret}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
      >
        Pay ${amount / 100}
      </button>
    </form>
  );
};

// Main Checkout Component
const Checkout = () => {
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [checkoutId, setCheckoutId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Bank");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart?.products?.length) navigate("/");
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.products?.length) return;

    try {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod,
          totalPrice: cart.totalPrice,
        })
      ).unwrap();

      if (res?._id) setCheckoutId(res._id);

      if (paymentMethod === "Bank") {
        toast.success("✅ Checkout Created! Complete payment via bank.");
      }
    } catch (err) {
      toast.error("Failed to create checkout.");
    }
  };

  const handleBankPaymentConfirm = () => {
    navigate(`/order-confirmation/${checkoutId}`);
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10">Error: {error}</p>;
  if (!cart?.products?.length) return <p className="text-center py-10">Your cart is empty</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* LEFT SIDE */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="uppercase text-2xl mb-6 font-semibold">Checkout</h2>

        {!checkoutId ? (
          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <h2 className="text-lg mb-4 font-bold">Shipping Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="firstName" value={shippingAddress.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" required />
              <input type="text" name="lastName" value={shippingAddress.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" required />
            </div>

            <input type="text" name="address" value={shippingAddress.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded" required />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} placeholder="City" className="border p-2 rounded" required />
              <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} placeholder="Postal Code" className="border p-2 rounded" required />
            </div>

            <select name="country" value={shippingAddress.country} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Select Country</option>
              <option value="Pakistan">Pakistan</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
            </select>

            <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded" required />

            {/* Payment Method */}
            <div className="mt-4">
              <label className="mr-4">
                <input type="radio" name="paymentMethod" value="Bank" checked={paymentMethod === "Bank"} onChange={() => setPaymentMethod("Bank")} className="mr-1" />
                Bank Transfer
              </label>
              <label>
                <input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === "Card"} onChange={() => setPaymentMethod("Card")} className="mr-1" />
                Card Payment
              </label>
            </div>

            <button type="submit" className="w-full bg-black text-white py-3 rounded">Continue to Payment</button>
          </form>
        ) : paymentMethod === "Bank" ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">💳 Bank Payment Details</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <p><span className="font-medium">Bank Name:</span> HBL Bank</p>
              <p><span className="font-medium">Account Title:</span> M-Collection</p>
              <p><span className="font-medium">IBAN:</span> PK12HBL000012345678900</p>
              <p className="text-sm text-gray-500 mt-2">
                Please make your payment and click "Confirm Payment" after transfer.
              </p>
            </div>
            <button type="button" onClick={handleBankPaymentConfirm} className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600">
              Confirm Payment
            </button>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <StripeCheckoutForm amount={cart.totalPrice * 100} checkoutId={checkoutId} />
          </Elements>
        )}
      </div>

      {/* RIGHT SIDE — Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        {cart.products.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-3 border-b pb-3">
            <div className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.color} | Size {item.size}</p>
              </div>
            </div>
            <span className="font-semibold">{item.price}</span>
          </div>
        ))}
        <hr className="my-3" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{cart.totalPrice?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
