import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return response.data; // full cart object
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch cart" });
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      return response.data; // full updated cart
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add to cart" });
    }
  }
);

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      return response.data; // full updated cart
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update cart" });
    }
  }
);
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { userId, guestId }
      );
      return response.data; // merged cart object
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to merge cart" });
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        data: { productId, size, color, userId, guestId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to remove from cart" });
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })
      // updateCartItemQuantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update cart item quantity";
      })
       .addCase(mergeCart.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(mergeCart.fulfilled, (state, action) => {
    state.loading = false;
    state.cart = action.payload;
    saveCartToStorage(action.payload);
  })
  .addCase(mergeCart.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.message || "Failed to merge cart";
  })
      // removeFromCart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
