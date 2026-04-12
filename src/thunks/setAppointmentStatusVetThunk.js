import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const updateVetAppointmentStatus = createAsyncThunk(
  'setAppointmentStatusVet/updateStatus',
  async ({ vetId, appointmentId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/admin/vet/${vetId}/appointment/${appointmentId}/status`,
        { status }
      );
      
      return {
        appointmentId,
        updatedAppointment: response.data.data || response.data,
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Failed to update appointment status'
        );
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);