import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchBreeds = createAsyncThunk(
  'breed/fetchBreeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/auth/getBreed');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch breeds'
      );
    }
  }
);