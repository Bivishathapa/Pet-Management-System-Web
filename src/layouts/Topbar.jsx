import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDetailsThunk } from '../thunks/getUserDetailsThunk';
import { fetchNotifications, fetchUnreadCount, markNotificationAsRead } from '../thunks/getNotificationsThunk';
import { markOneAsReadLocally } from '../feature/getNotificationsSlice';
import { Menu, Bell } from 'lucide-react';
import { profileImageUrl } from '../utils/profileImageUrl';
import { dashboardHomePathForRole } from '../constants/dashboardHomeByRole';
import BrandLogo from '../components/BrandLogo';

const profileRouteByRole = {
  1: '/dashboard/profile',
  2: '/dashboard/profile',
  3: '/dashboard/vet-profile',
  4: '/dashboard/groomer-profile',
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export default function Topbar({ setSidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authState = useSelector((state) => state.auth);
  const { userDetails } = useSelector((state) => state.userDetails);
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);

  const userData = authState?.user?.data || authState?.user;
  const user = userData?.user;
  const petFromAuth = userData?.pet;

  const roleId = user?.roleId;
  const profileRoute = profileRouteByRole[roleId] || '/dashboard/profile';

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserDetailsThunk({ userId: user.id, petId: petFromAuth?.id ?? 0 }));
    }
  }, [dispatch, user?.id, petFromAuth?.id]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications());
      dispatch(fetchUnreadCount());
      
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
        dispatch(fetchUnreadCount());
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const petData = userDetails?.pets?.[0];
  const breedData = petData?.breeds;
  const userPhoto = profileImageUrl(user?.profileImage || userDetails?.profileImage);
  const breedPhoto = breedData?.image
    ? `${import.meta.env.VITE_BASE_URL}/${breedData.image}`
    : null;
  const profileImage = userPhoto || breedPhoto;

  const markOneRead = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.isRead) {
      dispatch(markNotificationAsRead(id));
      setTimeout(() => {
        dispatch(fetchUnreadCount());
      }, 500);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-rose-600 hover:text-rose-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center flex-wrap min-w-0">
            <BrandLogo
              onClick={() => navigate(dashboardHomePathForRole(roleId))}
              imgClassName="h-9 sm:h-10 w-auto max-w-[190px] sm:max-w-[220px] object-contain object-left"
              ariaLabel="Go to dashboard home"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-rose-100/70 transition-colors"
            >
              <Bell className="w-6 h-6 text-rose-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-rose-200 overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-rose-100">
                  <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-slate-700 font-medium">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {loading && notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-400">Loading notifications...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => markOneRead(notification.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-rose-50 transition-colors ${!notification.isRead ? 'bg-rose-50/80' : ''}`}
                      >
                        <div className="mt-1.5 shrink-0">
                          {!notification.isRead
                            ? <span className="w-2 h-2 rounded-full bg-rose-600 block"></span>
                            : <span className="w-2 h-2 rounded-full bg-transparent block"></span>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold text-gray-800 ${!notification.isRead ? '' : 'font-medium'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div
            onClick={() => navigate(profileRoute)}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-800 truncate max-w-40">
                {user?.email || 'No email'}
              </p>
              {user?.roleName && (
                <p className="text-xs text-slate-600 font-medium">{user.roleName}</p>
              )}
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-600 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-rose-200">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={user?.email || 'Profile'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-white font-bold text-lg">${user?.email?.charAt(0)?.toUpperCase() || 'U'}</span>`;
                  }}
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}