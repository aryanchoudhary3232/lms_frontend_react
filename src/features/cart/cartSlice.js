import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (calculateTotal, { rejectWithValue }) => {
    try {
      console.log("..........");

      const response = await api.get("/cart");
      console.log(response);
      const items = response.data.data.items.map((i) => ({
        id: i.course._id,
        title: i.course.title,
        instructor: i.course.description, // adjust if needed
        price: i.course.price,
        thumbnail: i.course.image,
      }));
      calculateTotal(items);

      return items;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (courseId, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/remove/${courseId}`);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
