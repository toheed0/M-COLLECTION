import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user info from localStorage if exists
const userFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Guest ID handling
const initialGuestId = localStorage.getItem('guestId') || `guest_${new Date().getTime()}`;
localStorage.setItem('guestId', initialGuestId);

const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// ✅ LOGIN USER
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );

      // ✅ Use consistent key name everywhere
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      localStorage.setItem('userToken', response.data.token);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ REGISTER USER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );

      // ✅ Use consistent key name everywhere
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      localStorage.setItem('userToken', response.data.token);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;

      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
      localStorage.setItem('guestId', state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem('guestId', state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // ✅ Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
