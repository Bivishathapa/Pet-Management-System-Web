import { createSlice } from '@reduxjs/toolkit';
import { createAppointment } from '../thunks/createAppointmentThunk';

const createAppointmentSlice = createSlice({
  name: 'createAppointment',
  initialState: {
    appointment: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAppointmentState: (state) => {
      state.appointment = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create appointment';
        state.success = false;
      });
  },
});

export const { resetAppointmentState } = createAppointmentSlice.actions;
export default createAppointmentSlice.reducer;