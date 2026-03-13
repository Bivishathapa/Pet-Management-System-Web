import { createSlice } from '@reduxjs/toolkit';
import { fetchGroomerProfile } from '../thunks/getGroomerProfileThunk';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const getGroomerProfileSlice = createSlice({
  name: 'groomerProfile',
  initialState,
  reducers: {
    clearGroomerProfileError: (state) => {
      state.error = null;
    },
    updateGroomerProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },
    updateGroomerStatus: (state, action) => {
      if (state.profile) {
        state.profile.status = action.payload;
      }
    },
    clearGroomerProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroomerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchGroomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch groomer profile';
      });
  },
});

export const { 
  clearGroomerProfileError, 
  updateGroomerProfile,
  updateGroomerStatus,
  clearGroomerProfile 
} = getGroomerProfileSlice.actions;

export default getGroomerProfileSlice.reducer;