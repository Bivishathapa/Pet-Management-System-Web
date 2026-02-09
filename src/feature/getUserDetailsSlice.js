import { createSlice } from '@reduxjs/toolkit';
import { getUserDetailsThunk } from '../thunks/getUserDetailsThunk';

const initialState = {
  userDetails: null,
  loading: false,
  error: null,
};

const getUserDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    clearUserDetails: (state) => {
      state.userDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
        state.error = null;
      })
      .addCase(getUserDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user details';
      });
  },
});

export const { clearUserDetails } = getUserDetailsSlice.actions;
export default getUserDetailsSlice.reducer;