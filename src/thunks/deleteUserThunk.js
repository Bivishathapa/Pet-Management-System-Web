import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const deleteUser = createAsyncThunk(
  'user/delete',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/Admin/manage/${userId}`);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);