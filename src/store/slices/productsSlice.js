import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  categories: [],
  filters: {
    category: '',
    priceRange: [0, 1000],
    search: '',
    sortBy: 'name'
  },
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 1000],
        search: '',
        sortBy: 'name'
      };
    }
  },
});

export const {
  setProducts,
  setCategories,
  setLoading,
  setError,
  updateFilters,
  clearFilters
} = productsSlice.actions;

export default productsSlice.reducer;