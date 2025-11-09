import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all orders of logged-in user
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/orders/myorders`;
      
      console.log("🔍 API Call Details:", {
        url,
        tokenExists: !!token,
        token: token ? `${token.substring(0, 10)}...` : 'No token'
      });

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch orders" }
      );
    }
  }
);

// ✅ Fetch single order details
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch order details" }
      );
    }
  }
);

// ✅ Create new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // automatically refresh user orders
      dispatch(fetchUserOrders());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create order" }
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // fetchOrderDetails
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        // order already added via fetchUserOrders dispatch
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default orderSlice.reducer;
