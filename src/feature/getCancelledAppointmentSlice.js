import { createSlice } from '@reduxjs/toolkit';
import { fetchCancelledAppointments } from '../thunks/getCancelledAppointmentThunk';

const cancelledAppointmentSlice = createSlice({
  name: 'cancelledAppointments',
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCancelledAppointments: (state) => {
      state.appointments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCancelledAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCancelledAppointments.fulfilled, (state, action) => {
        state.loading = false;
        const appointments = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload?.data || []);
        
        state.appointments = appointments;
        state.error = null;
      })
      .addCase(fetchCancelledAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cancelled appointments';
      });
  },
});

export const { clearCancelledAppointments } = cancelledAppointmentSlice.actions;
export default cancelledAppointmentSlice.reducer;