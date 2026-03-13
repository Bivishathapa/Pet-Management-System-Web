import { createSlice } from '@reduxjs/toolkit';
import { deleteProfessional } from '../thunks/deleteProfessionalThunk';

const deleteProfessionalSlice = createSlice({
  name: 'deleteProfessional',
  initialState: {
    deletedProfessionalId: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetDeleteProfessionalState: (state) => {
      state.deletedProfessionalId = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteProfessional.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProfessional.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedProfessionalId = action.payload.professionalId;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteProfessional.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete professional';
        state.success = false;
      });
  },
});

export const { resetDeleteProfessionalState } = deleteProfessionalSlice.actions;
export default deleteProfessionalSlice.reducer;