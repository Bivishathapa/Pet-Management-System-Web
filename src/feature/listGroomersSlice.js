import { createSlice } from '@reduxjs/toolkit';
import { fetchGroomers } from '../thunks/listGroomersThunk';

const initialState = {
  groomers: [],
  loading: false,
  error: null,
};

const listGroomersSlice = createSlice({
  name: 'groomers',
  initialState,
  reducers: {
    clearGroomersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroomers.fulfilled, (state, action) => {
        state.loading = false;
        state.groomers = action.payload;
        state.error = null;
      })
      .addCase(fetchGroomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch groomers';
      });
  },
});

export const { clearGroomersError } = listGroomersSlice.actions;
export default listGroomersSlice.reducer;