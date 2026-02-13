import { createSlice } from '@reduxjs/toolkit';
import { listProfessionals } from '../thunks/listProfessionalsThunk';

const listProfessionalsSlice = createSlice({
  name: 'listProfessionals',
  initialState: {
    professionals: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetListProfessionalsState: (state) => {
      state.professionals = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listProfessionals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProfessionals.fulfilled, (state, action) => {
        state.loading = false;
        state.professionals = action.payload;
        state.error = null;
      })
      .addCase(listProfessionals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch professionals';
      });
  },
});

export const { resetListProfessionalsState } = listProfessionalsSlice.actions;
export default listProfessionalsSlice.reducer;