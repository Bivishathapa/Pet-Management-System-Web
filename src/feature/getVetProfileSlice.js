import { createSlice } from '@reduxjs/toolkit';
import { fetchVetProfile } from '../thunks/getVetProfileThunk';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const getVetProfileSlice = createSlice({
  name: 'vetProfile',
  initialState,
  reducers: {
    clearVetProfileError: (state) => {
      state.error = null;
    },
    updateVetProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },
    updateVetStatus: (state, action) => {
      if (state.profile) {
        state.profile.status = action.payload;
      }
    },
    clearVetProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVetProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVetProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchVetProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vet profile';
      });
  },
});

export const { 
  clearVetProfileError, 
  updateVetProfile,
  updateVetStatus,
  clearVetProfile 
} = getVetProfileSlice.actions;

export default getVetProfileSlice.reducer;