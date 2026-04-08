import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchVets = createAsyncThunk(
  'vets/fetchVets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/vet/get');
      return response.data.data || [];
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch veterinarians');
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);