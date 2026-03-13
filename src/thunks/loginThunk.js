import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../utils/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user, pet } = response.data.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify({ user, pet }));

      return {
        user: { user, pet },
        accessToken: token,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);