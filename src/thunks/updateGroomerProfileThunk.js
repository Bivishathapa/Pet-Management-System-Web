import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const updateGroomerProfileThunk = createAsyncThunk(
  'updateGroomerProfile/update',
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await api.put('/admin/vet/profile/update', updateData);
      
      return response.data.data || response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Failed to update profile'
        );
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);