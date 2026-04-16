import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { mergeAuthUserFields } from '../feature/loginSlice';

export const uploadProfilePictureThunk = createAsyncThunk(
  'profile/uploadPicture',
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await api.post('/user/profile/picture', formData);
      const profileImage = response.data?.data?.profileImage ?? null;
      dispatch(mergeAuthUserFields({ profileImage }));
      return profileImage;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload profile picture'
      );
    }
  }
);

export const removeProfilePictureThunk = createAsyncThunk(
  'profile/removePicture',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await api.delete('/user/profile/picture');
      dispatch(mergeAuthUserFields({ profileImage: null }));
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove profile picture'
      );
    }
  }
);
