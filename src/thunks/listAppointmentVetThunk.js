import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchVetAppointments = createAsyncThunk(
  'vetAppointments/fetchVetAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/vet/list');
      return response.data.data || response.data || [];
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch vet appointments');
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);