import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const assignUserProfession = createAsyncThunk(
  'admin/assignUserProfession',
  async ({ userId, professionData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/Admin/manage/users/${userId}/assign-profession`, professionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to assign profession'
      );
    }
  }
);
