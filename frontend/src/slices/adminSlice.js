import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Fetch all users (admin)
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ✅ Add user (admin)
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ✅ Update user (admin)
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { name, email, role },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ✅ Delete user (admin)
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// -------------------- SLICE --------------------
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH USERS
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      // ADD USER
      .addCase(addUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addUser.fulfilled, (state, action) => { state.loading = false; state.users.push(action.payload); })
      .addCase(addUser.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

      // UPDATE USER
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => { state.error = action.payload?.message; })

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => { state.error = action.payload?.message; });
  },
});

export default adminSlice.reducer;
