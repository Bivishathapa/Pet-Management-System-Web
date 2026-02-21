import { createSlice } from '@reduxjs/toolkit';
import { updateGroomerAppointmentStatus } from '../thunks/setAppointmentStatusGroomerThunk';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const setAppointmentStatusGroomerSlice = createSlice({
  name: 'setAppointmentStatusGroomer',
  initialState,
  reducers: {
    clearStatusUpdateError: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateGroomerAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateGroomerAppointmentStatus.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateGroomerAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update appointment status';
        state.success = false;
      });
  },
});

export const { clearStatusUpdateError } = setAppointmentStatusGroomerSlice.actions;

export default setAppointmentStatusGroomerSlice.reducer;