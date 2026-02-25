import { createSlice } from '@reduxjs/toolkit';
import { verifyKhaltiPayment } from '../thunks/verifyPaymentThunk';

const initialState = {
  loading: false,
  error: null,
  success: false,
  verifyData: null,
};

const verifyPaymentSlice = createSlice({
  name: 'verifyPayment',
  initialState,
  reducers: {
    clearVerifyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.verifyData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyKhaltiPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.verifyData = null;
      })
      .addCase(verifyKhaltiPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.verifyData = action.payload;
      })
      .addCase(verifyKhaltiPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Payment verification failed';
        state.success = false;
        state.verifyData = null;
      });
  },
});

export const { clearVerifyState } = verifyPaymentSlice.actions;
export default verifyPaymentSlice.reducer;