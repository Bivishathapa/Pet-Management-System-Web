import { createSlice } from '@reduxjs/toolkit';
import { updateUserProfileThunk } from '../thunks/updateUserProfileThunk';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateUserProfileSlice = createSlice({
  name: 'updateUserProfile',
  initialState,
  reducers: {
    clearUpdateState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
        state.success = false;
      });
  },
});

export const { clearUpdateState } = updateUserProfileSlice.actions;

export default updateUserProfileSlice.reducer;