import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  selectedCategory: "All",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setSearchTerm,
  setSelectedCategory,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
