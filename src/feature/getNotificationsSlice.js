import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchNotifications, 
  fetchUnreadCount,
  markNotificationAsRead
} from '../thunks/getNotificationsThunk';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
      state.unreadCount = 0;
    },
    markOneAsReadLocally: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const notifications = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload?.data || []);
        
        state.notifications = notifications;
        state.unreadCount = notifications.filter(n => !n.isRead).length;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })
      
      .addCase(fetchUnreadCount.pending, (state) => {
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        const count = action.payload?.unreadCount ?? action.payload?.data?.unreadCount ?? 0;
        state.unreadCount = count;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
      })      
      .addCase(markNotificationAsRead.pending, (state, action) => {
        const notificationId = action.meta.arg;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        const notificationId = action.meta.arg;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = false;
          state.unreadCount = state.unreadCount + 1;
        }
      });
  },
});

export const { clearNotifications, markOneAsReadLocally } = notificationsSlice.actions;
export default notificationsSlice.reducer;