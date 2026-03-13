import { createSlice } from '@reduxjs/toolkit';
import { deleteUser } from '../thunks/deleteUserThunk';

const deleteUserSlice = createSlice({
  name: 'deleteUser',
  initialState: {
    deletedUserId: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetDeleteUserState: (state) => {
      state.deletedUserId = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedUserId = action.payload.userId;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
        state.success = false;
      });
  },
});

export const { resetDeleteUserState } = deleteUserSlice.actions;
export default deleteUserSlice.reducer;