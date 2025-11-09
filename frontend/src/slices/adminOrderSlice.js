import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Helper: Get token safely
const getAuthHeader = () => {
  const token = localStorage.getItem("userToken");
  console.log("🟡 Admin Order Token:", token); // Debug: Check if token exists
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// -------------------- FETCH ALL ORDERS --------------------
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeader();
      console.log("📦 Fetch Orders Headers:", headers); // Debug header
      const res = await axios.get(`${API_URL}/api/admin/orders`, { headers });
      return res.data;
    } catch (error) {
      console.error("❌ Fetch Orders Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// -------------------- UPDATE ORDER STATUS --------------------
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeader();
      console.log("📦 Update Order Headers:", headers);
      const res = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status },
        { headers }
      );
      return res.data;
    } catch (error) {
      console.error("❌ Update Order Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// -------------------- DELETE ORDER --------------------
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeader();
      console.log("📦 Delete Order Headers:", headers);
      await axios.delete(`${API_URL}/api/admin/orders/${id}`, { headers });
      return id;
    } catch (error) {
      console.error("❌ Delete Order Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// -------------------- SLICE --------------------
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ FETCH ALL ORDERS
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce(
          (acc, order) => acc + (order.totalPrice || 0),
          0
        );
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // ✅ UPDATE ORDER STATUS
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })

      // ✅ DELETE ORDER
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});

export default adminOrderSlice.reducer;
