import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const editProfessional = createAsyncThunk(
  'professional/edit',
  async ({ professionalId, professionalData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/Admin/manage/${professionalId}`, professionalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update professional'
      );
    }
  }
);