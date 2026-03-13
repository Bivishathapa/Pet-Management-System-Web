import { createSlice } from '@reduxjs/toolkit';
import { fetchGroomerAppointments } from '../thunks/listAppointmentGroomerThunk';
import { updateGroomerAppointmentStatus } from '../thunks/setAppointmentStatusGroomerThunk';

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

const listAppointmentGroomerSlice = createSlice({
  name: 'groomerAppointments',
  initialState,
  reducers: {
    clearGroomerAppointmentsError: (state) => {
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
      .addCase(fetchGroomerAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroomerAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(fetchGroomerAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch groomer appointments';
      })
      .addCase(updateGroomerAppointmentStatus.fulfilled, (state, action) => {
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
  clearGroomerAppointmentsError, 
  updateAppointmentStatus,
  updateAppointment 
} = listAppointmentGroomerSlice.actions;

export default listAppointmentGroomerSlice.reducer;