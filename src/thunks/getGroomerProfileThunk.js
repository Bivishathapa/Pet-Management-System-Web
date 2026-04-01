import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchGroomerProfile = createAsyncThunk(
  'groomerProfile/fetchGroomerProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/user/groomer/get');
      
      const groomers = response.data.data || response.data || [];
      const state = getState();
      const authState = state.auth;
      const userData = authState?.user?.data || authState?.user;
      const currentUserId = userData?.user?.id;
      
      if (currentUserId && groomers.length > 0) {
        const userGroomer = groomers.find(groomer => groomer.userId === currentUserId);
        return userGroomer || groomers[0]; 
      }
      
      return groomers.length > 0 ? groomers[0] : null;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch groomer profile');
      }
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);
