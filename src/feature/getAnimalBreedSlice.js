import { createSlice } from '@reduxjs/toolkit';
import { fetchBreeds } from '../thunks/getAnimalBreedThunk';

const initialState = {
  breeds: [],
  loading: false,
  error: null,
  speciesList: [],
  breedsBySpecies: {},
};

const breedSlice = createSlice({
  name: 'breed',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBreeds.fulfilled, (state, action) => {
        state.loading = false;
        state.breeds = action.payload;
        
        // Extract unique species
        const uniqueSpecies = [...new Set(action.payload.map(breed => breed.species))];
        state.speciesList = uniqueSpecies.sort();
        
        // Group breeds by species
        const grouped = {};
        action.payload.forEach(breed => {
          if (!grouped[breed.species]) {
            grouped[breed.species] = [];
          }
          grouped[breed.species].push(breed);
        });
        
        // Sort breeds within each species
        Object.keys(grouped).forEach(species => {
          grouped[species].sort((a, b) => a.name.localeCompare(b.name));
        });
        
        state.breedsBySpecies = grouped;
      })
      .addCase(fetchBreeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch breeds';
      });
  },
});

export const { clearError } = breedSlice.actions;
export default breedSlice.reducer;