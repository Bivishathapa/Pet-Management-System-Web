import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { getLoggedInUserId } from '../utils/getLoggedInUserId';

export const addPet = createAsyncThunk(
  'pet/add',
  async ({ petData }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = getLoggedInUserId(state);

      if (!userId) {
        return rejectWithValue('User ID not found. Please log in again.');
      }

      const response = await api.post(
        `/user/pet/${userId}/create`,
        petData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add pet'
      );
    }
  }
);