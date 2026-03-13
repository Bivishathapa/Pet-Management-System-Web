import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const editUser = createAsyncThunk(
  'user/edit',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/Admin/manage/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user'
      );
    }
  }
);