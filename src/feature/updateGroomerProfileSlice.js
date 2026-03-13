import { createSlice } from '@reduxjs/toolkit';
import { updateGroomerProfileThunk } from '../thunks/updateGroomerProfileThunk';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateGroomerProfileSlice = createSlice({
  name: 'updateGroomerProfile',
  initialState,
  reducers: {
    clearUpdateGroomerState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateGroomerProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateGroomerProfileThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateGroomerProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
        state.success = false;
      });
  },
});

export const { clearUpdateGroomerState } = updateGroomerProfileSlice.actions;

export default updateGroomerProfileSlice.reducer;