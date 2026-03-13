import { createSlice } from '@reduxjs/toolkit';
import { editProfessional } from '../thunks/editProfessionalDetailsThunk';

const editProfessionalSlice = createSlice({
  name: 'editProfessional',
  initialState: {
    professional: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetEditProfessionalState: (state) => {
      state.professional = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProfessional.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editProfessional.fulfilled, (state, action) => {
        state.loading = false;
        state.professional = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(editProfessional.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update professional';
        state.success = false;
      });
  },
});

export const { resetEditProfessionalState } = editProfessionalSlice.actions;
export default editProfessionalSlice.reducer;