import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const createProfessional = createAsyncThunk(
  'professional/create',
  async ({ professionalData }, { rejectWithValue }) => {
    try {
      const response = await api.post('/Admin/manage/create', professionalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create professional'
      );
    }
  }
);