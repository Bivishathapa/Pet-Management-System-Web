import { createSlice } from '@reduxjs/toolkit';
import { rescheduleAppointment, cancelAppointment } from '../thunks/rescheduleAppointmentThunk';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const rescheduleAppointmentSlice = createSlice({
  name: 'rescheduleAppointment',
  initialState,
  reducers: {
    clearRescheduleState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rescheduleAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(rescheduleAppointment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reschedule appointment';
        state.success = false;
      })
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelAppointment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to cancel appointment';
        state.success = false;
      });
  },
});

export const { clearRescheduleState } = rescheduleAppointmentSlice.actions;

export default rescheduleAppointmentSlice.reducer;