import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchGroomers = createAsyncThunk(
  'groomers/fetchGroomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/groomer/get');
      return response.data.data || [];
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch groomers');
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);