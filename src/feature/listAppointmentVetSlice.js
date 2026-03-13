import { createSlice } from '@reduxjs/toolkit';
import { fetchVetAppointments } from '../thunks/listAppointmentVetThunk';
import { updateVetAppointmentStatus } from '../thunks/setAppointmentStatusVetThunk';

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

const listAppointmentVetSlice = createSlice({
  name: 'vetAppointments',
  initialState,
  reducers: {
    clearVetAppointmentsError: (state) => {
      state.error = null;
    },
    updateAppointmentStatus: (state, action) => {
      const { id, status } = action.payload;
      const appointment = state.appointments.find(apt => apt.id === id);
      if (appointment) {
        appointment.status = status;
      }
    },
    updateAppointment: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.appointments.findIndex(apt => apt.id === id);
      if (index !== -1) {
        state.appointments[index] = {
          ...state.appointments[index],
          ...updates,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVetAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVetAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(fetchVetAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vet appointments';
      })
      .addCase(updateVetAppointmentStatus.fulfilled, (state, action) => {
        const { appointmentId, updatedAppointment } = action.payload;
        const index = state.appointments.findIndex(apt => apt.id === appointmentId);
        if (index !== -1) {
          state.appointments[index] = {
            ...state.appointments[index],
            ...updatedAppointment,
            status: updatedAppointment.status || state.appointments[index].status,
          };
        }
      });
  },
});

export const { 
  clearVetAppointmentsError, 
  updateAppointmentStatus,
  updateAppointment 
} = listAppointmentVetSlice.actions;

export default listAppointmentVetSlice.reducer;