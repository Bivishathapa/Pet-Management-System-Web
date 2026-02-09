import { createSlice } from '@reduxjs/toolkit';
import { fetchUpcomingAppointments } from '../thunks/getUpcomingAppointmentThunk';

const upcomingAppointmentSlice = createSlice({
  name: 'upcomingAppointments',
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUpcomingAppointments: (state) => {
      state.appointments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingAppointments.fulfilled, (state, action) => {
        state.loading = false;
        const appointments = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload?.data || []);
        
        state.appointments = appointments;
        state.error = null;
      })
      .addCase(fetchUpcomingAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch upcoming appointments';
      });
  },
});

export const { clearUpcomingAppointments } = upcomingAppointmentSlice.actions;
export default upcomingAppointmentSlice.reducer;