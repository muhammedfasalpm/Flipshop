import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Helper function to calculate total cart price from items
const calculateTotalAmount = (items) => {
  return items.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);
};

// Helper function to get product ID string safely
const getProductId = (item) => {
  if (!item) return null;
  if (typeof item.product === "object" && item.product !== null) {
    const id = item.product._id || item.product.id;
    return id ? id.toString() : null;
  }
  return item.product ? item.product.toString() : null;
};

// 1. Fetch Cart Thunk (Runs ONCE per authenticated session)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return { items: [], totalPrice: 0 };
    }
    try {
      const res = await api.get(`/api/cart/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// 2. Add To Cart Thunk with Optimistic Update & Rollback
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ product, quantity = 1, userId }, { getState, dispatch, rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue("Please sign in to add items to your cart");
    }

    const productId = product?._id || product?.id;
    if (!productId) {
      return rejectWithValue("Invalid product ID");
    }

    const previousCart = getState().cart;
    const qtyToAdd = parseInt(quantity, 10) > 0 ? parseInt(quantity, 10) : 1;

    // Apply Optimistic Update in Redux Store
    dispatch(optimisticAddToCart({ product, quantity: qtyToAdd }));

    try {
      const res = await api.post("/api/cart/add", {
        userId,
        productId,
        quantity: qtyToAdd,
      });
      return res.data;
    } catch (error) {
      // Rollback to previous state on failure
      dispatch(rollbackCart(previousCart));
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

// 3. Update Quantity Thunk with Optimistic Update & Rollback
export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async ({ productId, quantity, userId }, { getState, dispatch, rejectWithValue }) => {
    if (!userId || !productId) return rejectWithValue("Invalid request");

    const previousCart = getState().cart;
    const newQty = quantity < 1 ? 1 : quantity;

    // Apply Optimistic Update
    dispatch(optimisticUpdateQuantity({ productId, quantity: newQty }));

    try {
      const res = await api.put(`/api/cart/update/${productId}`, {
        userId,
        quantity: newQty,
      });
      return res.data;
    } catch (error) {
      // Rollback to previous state on failure
      dispatch(rollbackCart(previousCart));
      return rejectWithValue(
        error.response?.data?.message || "Failed to update item quantity"
      );
    }
  }
);

// 4. Remove From Cart Thunk with Optimistic Update & Rollback
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async ({ productId, userId }, { getState, dispatch, rejectWithValue }) => {
    if (!userId || !productId) return rejectWithValue("Invalid request");

    const previousCart = getState().cart;

    // Apply Optimistic Update
    dispatch(optimisticRemoveFromCart({ productId }));

    try {
      const res = await api.delete(`/api/cart/remove/${productId}`, {
        data: { userId },
      });
      return res.data;
    } catch (error) {
      // Rollback to previous state on failure
      dispatch(rollbackCart(previousCart));
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
  }
);

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
  hydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    optimisticAddToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const targetId = (product?._id || product?.id)?.toString();
      const existingIndex = state.items.findIndex(
        (item) => getProductId(item) === targetId
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          price: product?.price || 0,
        });
      }
      state.totalAmount = calculateTotalAmount(state.items);
      state.error = null;
    },
    optimisticUpdateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(
        (item) => getProductId(item) === productId
      );
      if (item) {
        item.quantity = quantity;
        state.totalAmount = calculateTotalAmount(state.items);
      }
      state.error = null;
    },
    optimisticRemoveFromCart: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter(
        (item) => getProductId(item) !== productId
      );
      state.totalAmount = calculateTotalAmount(state.items);
      state.error = null;
    },
    rollbackCart: (state, action) => {
      state.items = action.payload.items;
      state.totalAmount = action.payload.totalAmount;
      state.error = action.payload.error || "Action failed. Restored cart.";
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.error = null;
    },
    resetHydration: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.loading = false;
      state.error = null;
      state.hydrated = false;
    },
    clearCartError: (state) => {
      state.error = null;
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
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalPrice || calculateTotalAmount(state.items);
        state.hydrated = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hydrated = true;
      })
      // addToCartAsync fulfilled (keep optimistic state, update total if server returns it)
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        if (action.payload?.cart?.totalPrice !== undefined) {
          state.totalAmount = action.payload.cart.totalPrice;
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload;
        }
      })
      // updateQuantityAsync fulfilled
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        if (action.payload?.totalPrice !== undefined) {
          state.totalAmount = action.payload.totalPrice;
        }
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload;
        }
      })
      // removeFromCartAsync fulfilled
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        if (action.payload?.cart?.totalPrice !== undefined) {
          state.totalAmount = action.payload.cart.totalPrice;
        }
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload;
        }
      });
  },
});

export const {
  optimisticAddToCart,
  optimisticUpdateQuantity,
  optimisticRemoveFromCart,
  rollbackCart,
  clearCart,
  resetHydration,
  clearCartError,
} = cartSlice.actions;

// Derived Selector for Total Quantity (Cart Item Count across all items)
export const selectCartItemCount = (state) => {
  return state.cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
};

export default cartSlice.reducer;
