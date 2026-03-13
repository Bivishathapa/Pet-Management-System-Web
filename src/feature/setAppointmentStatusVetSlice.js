import { createSlice } from '@reduxjs/toolkit';
import { updateVetAppointmentStatus } from '../thunks/setAppointmentStatusVetThunk';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const setAppointmentStatusVetSlice = createSlice({
  name: 'setAppointmentStatusVet',
  initialState,
  reducers: {
    clearStatusUpdateError: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVetAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVetAppointmentStatus.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateVetAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update appointment status';
        state.success = false;
      });
  },
});

export const { clearStatusUpdateError } = setAppointmentStatusVetSlice.actions;

export default setAppointmentStatusVetSlice.reducer;