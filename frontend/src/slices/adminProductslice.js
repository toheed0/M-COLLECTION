import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Get Token Dynamically
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("userToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (isMultipart) headers["Content-Type"] = "multipart/form-data";
  else headers["Content-Type"] = "application/json";
  return headers;
};

// 🧠 Fetch all admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/products`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ✏️ Fetch single product details
export const fetchProductDetails = createAsyncThunk(
  "adminProducts/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/products/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ➕ Create new product (multipart/form-data support)
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/admin/products`, productData, {
        headers: getAuthHeaders(true),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ✏️ Update product (multipart/form-data support if needed)
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData, isMultipart = false }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/api/admin/products/${id}`, productData, {
        headers: getAuthHeaders(isMultipart),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// 🗑️ Delete product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// -------------------- SLICE --------------------
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    selectProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })

      // FETCH SINGLE PRODUCT
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch product";
      })

      // CREATE PRODUCT
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.selectProduct = action.payload;
      })

      // UPDATE PRODUCT
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
        state.selectProduct = action.payload;
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export default adminProductSlice.reducer;
