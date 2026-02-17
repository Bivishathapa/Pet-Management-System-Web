import { createSlice } from '@reduxjs/toolkit';
import { initiatePayment } from '../thunks/makePaymentThunk';

const initialState = {
  loading: false,
  error: null,
  success: false,
  paymentData: null,
};

const makePaymentSlice = createSlice({
  name: 'makePayment',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.paymentData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.paymentData = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.paymentData = action.payload;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to initiate payment';
        state.success = false;
        state.paymentData = null;
      });
  },
});

export const { clearPaymentState } = makePaymentSlice.actions;
export default makePaymentSlice.reducer;