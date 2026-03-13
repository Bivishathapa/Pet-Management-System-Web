import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchUpcomingAppointments = createAsyncThunk(
  'appointments/fetchUpcoming',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/appointment/${userId}/upcoming`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch upcoming appointments'
      );
    }
  }
);