import { createSlice } from '@reduxjs/toolkit';
import { addPet } from '../thunks/addPetsThunk';

const addPetsSlice = createSlice({
  name: 'addPet',
  initialState: {
    pet: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPetState: (state) => {
      state.pet = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPet.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.loading = false;
        state.pet = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(addPet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add pet';
        state.success = false;
      });
  },
});

export const { resetPetState } = addPetsSlice.actions;
export default addPetsSlice.reducer;