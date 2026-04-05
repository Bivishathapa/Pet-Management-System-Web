import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../utils/api';

export const loginWithGoogle = createAsyncThunk(
  'auth/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await authAPI.googleLogin({ credential });
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
        'Google sign-in failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);
