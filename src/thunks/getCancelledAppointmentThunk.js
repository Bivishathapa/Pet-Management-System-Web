import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchCancelledAppointments = createAsyncThunk(
  'appointments/fetchCancelled',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/appointment/${userId}/cancelled`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cancelled appointments'
      );
    }
  }
);