import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const initiatePayment = createAsyncThunk(
  'makePayment/initiate',
  async ({ appointmentId, amount, method }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/payment/khalti/${appointmentId}/initiate`,
        { amount, method }
      );

      const data = response.data.data || response.data;

     if (data.pidx) {
        sessionStorage.setItem('khalti_pidx', data.pidx);
      }

      return {
        appointmentId,
        method,
        paymentData: data,
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Failed to initiate payment'
        );
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);