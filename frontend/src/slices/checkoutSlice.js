import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      // Check payment method
      if (checkoutData.paymentMethod === "Card") {
        // 1️⃣ Create Stripe PaymentIntent first
        const stripeRes = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-payment-intent`,
          { amount: checkoutData.totalPrice * 100 }, // Stripe expects amount in cents
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        return { clientSecret: stripeRes.data.clientSecret };
      } else {
        // 2️⃣ Bank Transfer: Create checkout/order directly
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
          checkoutData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        return res.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    clientSecret: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCheckout: (state) => {
      state.checkout = null;
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.clientSecret) {
          state.clientSecret = action.payload.clientSecret;
        } else {
          state.checkout = action.payload;
        }
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
