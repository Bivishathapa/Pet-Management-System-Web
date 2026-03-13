import { createSlice } from '@reduxjs/toolkit';
import { fetchCompletedAppointments } from '../thunks/getCompletedAppointmentThunk';

const completedAppointmentSlice = createSlice({
  name: 'completedAppointments',
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCompletedAppointments: (state) => {
      state.appointments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedAppointments.fulfilled, (state, action) => {
        state.loading = false;
        const appointments = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload?.data || []);
        
        state.appointments = appointments;
        state.error = null;
      })
      .addCase(fetchCompletedAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch completed appointments';
      });
  },
});

export const { clearCompletedAppointments } = completedAppointmentSlice.actions;
export default completedAppointmentSlice.reducer;