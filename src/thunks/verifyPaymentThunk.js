import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const verifyKhaltiPayment = createAsyncThunk(
  'verifyPayment/verify',
  async ({ pidx }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payment/khalti/verify`, {
        params: { pidx },
      });
      return response.data.data || response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Payment verification failed'
        );
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);