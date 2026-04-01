import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const getUserDetailsThunk = createAsyncThunk(
  'userDetails/getUserDetails',
  async ({ userId, petId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/pet/${petId}/petProfile/get`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);