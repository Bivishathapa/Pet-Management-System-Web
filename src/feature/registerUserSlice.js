import { createSlice } from '@reduxjs/toolkit';
import { registerUser } from '../thunks/registerUserThunk';

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const registerUserSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
        state.success = false;
      });
  },
});

export const { resetRegisterState, clearError } = registerUserSlice.actions;
export default registerUserSlice.reducer;