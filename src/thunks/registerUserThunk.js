import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../utils/api';

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message || 
        'Registration failed. Please try again.';
      
      return rejectWithValue(errorMessage);
    }
  }
);