import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// -------------------------
// Helper Functions
// -------------------------
const saveAuthData = (user, token) => {
  localStorage.setItem('userInfo', JSON.stringify(user));
  localStorage.setItem('userToken', token);
};

const clearAuthData = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userToken');
};

const generateGuestId = () => `guest_${new Date().getTime()}`;

const getGuestId = () => {
  let id = localStorage.getItem('guestId');
  if (!id) {
    id = generateGuestId();
    localStorage.setItem('guestId', id);
  }
  return id;
};

const getStoredUser = () => {
  const user = localStorage.getItem('userInfo');
  return user ? JSON.parse(user) : null;
};

const getStoredToken = () => localStorage.getItem('userToken') || null;

// -------------------------
// Initial State
// -------------------------
const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  guestId: getGuestId(),
  loading: false,
  error: null,
};

// -------------------------
// Login User Thunk
// -------------------------
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      saveAuthData(response.data.user, response.data.token);
      return response.data; // { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Try again.'
      );
    }
  }
);

// -------------------------
// Register User Thunk
// -------------------------
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      saveAuthData(response.data.user, response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Try again.'
      );
    }
  }
);

// -------------------------
// Auth Slice
// -------------------------
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.guestId = generateGuestId();

      clearAuthData();
      localStorage.setItem('guestId', state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = generateGuestId();
      localStorage.setItem('guestId', state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
