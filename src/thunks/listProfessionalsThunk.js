import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const listProfessionals = createAsyncThunk(
  'professionals/list',
  async ({ roleId, search } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (roleId && [3, 4].includes(Number(roleId))) params.roleId = roleId;
      if (search) params.search = search;

      const response = await api.get('/Admin/manage/list', { params });

      const data = response.data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch professionals'
      );
    }
  }
);