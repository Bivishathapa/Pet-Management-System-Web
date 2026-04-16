import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const uploadAdminUserProfilePictureThunk = createAsyncThunk(
  'admin/uploadUserProfilePicture',
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await api.post(`/Admin/manage/users/${userId}/profile-picture`, formData);
      return response.data?.data ?? response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload profile picture'
      );
    }
  }
);
