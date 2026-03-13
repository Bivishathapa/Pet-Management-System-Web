import { createSlice } from '@reduxjs/toolkit';
import { createProfessional } from '../thunks/createProfessionalThunk';

const createProfessionalSlice = createSlice({
  name: 'createProfessional',
  initialState: {
    professional: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetProfessionalState: (state) => {
      state.professional = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProfessional.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProfessional.fulfilled, (state, action) => {
        state.loading = false;
        state.professional = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createProfessional.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create professional';
        state.success = false;
      });
  },
});

export const { resetProfessionalState } = createProfessionalSlice.actions;
export default createProfessionalSlice.reducer;