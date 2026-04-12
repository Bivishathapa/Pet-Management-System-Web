import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const rescheduleAppointment = createAsyncThunk(
  'rescheduleAppointment/reschedule',
  async ({ appointmentId, appointmentDate, time }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/user/appointment/${appointmentId}/reschedule`,
        { appointmentDate, time }
      );
      
      return {
        appointmentId,
        updatedAppointment: response.data.data || response.data,
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Failed to reschedule appointment'
        );
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'rescheduleAppointment/cancel',
  async ({ appointmentId }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/user/appointment/${appointmentId}/reschedule`,
        { status: 'cancelled' }
      );
      
      return {
        appointmentId,
        updatedAppointment: response.data.data || response.data,
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Failed to cancel appointment'
        );
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);