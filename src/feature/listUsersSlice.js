import { createSlice } from '@reduxjs/toolkit';
import { listUsers } from '../thunks/listUsersThunk';

const listUsersSlice = createSlice({
  name: 'listUsers',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetListUsersState: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      });
  },
});

export const { resetListUsersState } = listUsersSlice.actions;
export default listUsersSlice.reducer;