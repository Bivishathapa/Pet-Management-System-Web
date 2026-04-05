import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchGroomerAppointments = createAsyncThunk(
  'groomerAppointments/fetchGroomerAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/groomer/list');
      return response.data.data || response.data || [];
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch groomer appointments');
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);