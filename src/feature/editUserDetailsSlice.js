import { createSlice } from '@reduxjs/toolkit';
import { editUser } from '../thunks/editUserDetailsThunk';

const editUserSlice = createSlice({
  name: 'editUser',
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetEditUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
        state.success = false;
      });
  },
});

export const { resetEditUserState } = editUserSlice.actions;
export default editUserSlice.reducer;