import { createSlice } from '@reduxjs/toolkit';
import { fetchVets } from '../thunks/listVetsThunk';

const initialState = {
  vets: [],
  loading: false,
  error: null,
};

const listVetsSlice = createSlice({
  name: 'vets',
  initialState,
  reducers: {
    clearVetsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVets.fulfilled, (state, action) => {
        state.loading = false;
        state.vets = action.payload;
        state.error = null;
      })
      .addCase(fetchVets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch veterinarians';
      });
  },
});

export const { clearVetsError } = listVetsSlice.actions;
export default listVetsSlice.reducer;