import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchCompletedAppointments = createAsyncThunk(
  'appointments/fetchCompleted',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/appointment/${userId}/completed`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch completed appointments'
      );
    }
  }
);