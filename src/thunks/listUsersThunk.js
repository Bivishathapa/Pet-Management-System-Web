import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const listUsers = createAsyncThunk(
  'users/list',
  async ({ name } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (name) params.name = name;

      const response = await api.get('/Admin/manage/users', { params });

      const data = response.data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);