import { createSlice } from '@reduxjs/toolkit';
import { updateVetProfileThunk } from '../thunks/updateVetProfileThunk';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateVetProfileSlice = createSlice({
  name: 'updateVetProfile',
  initialState,
  reducers: {
    clearUpdateVetState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVetProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVetProfileThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateVetProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
        state.success = false;
      });
  },
});

export const { clearUpdateVetState } = updateVetProfileSlice.actions;

export default updateVetProfileSlice.reducer;