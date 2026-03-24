import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const deleteProfessional = createAsyncThunk(
  'professional/delete',
  async ({ professionalId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/Admin/manage/${professionalId}`);
      return { professionalId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete professional'
      );
    }
  }
);