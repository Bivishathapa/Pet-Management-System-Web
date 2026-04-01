import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchVetProfile = createAsyncThunk(
  'vetProfile/fetchVetProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/user/vet/get');
      
      const vets = response.data.data || response.data || [];
      const state = getState();
      const authState = state.auth;
      const userData = authState?.user?.data || authState?.user;
      const currentUserId = userData?.user?.id;
      
      if (currentUserId && vets.length > 0) {
        const userVet = vets.find(vet => vet.userId === currentUserId);
        return userVet || vets[0]; 
      }
      
      return vets.length > 0 ? vets[0] : null;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch vet profile');
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);