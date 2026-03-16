import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroomerProfile } from '../../../thunks/getGroomerProfileThunk';
import { updateGroomerProfileThunk } from '../../../thunks/updateGroomerProfileThunk';
import { clearUpdateGroomerState } from '../../../feature/updateGroomerProfileSlice';
import {
  uploadProfilePictureThunk,
  removeProfilePictureThunk,
} from '../../../thunks/uploadProfilePictureThunk';
import { profileImageUrl } from '../../../utils/profileImageUrl';
import { AlertCircle, X, Edit2, Camera, Trash2 } from 'lucide-react';

export default function GroomerProfilePage() {
  const dispatch = useDispatch();
  
  const authState = useSelector((state) => state.auth);
  const userData = authState?.user?.data || authState?.user;
  const user = userData?.user;
  const { profile: groomerProfile, loading, error } = useSelector((state) => state.groomerProfile);
  const updateState = useSelector((state) => state.updateGroomerProfile);

  const [availability, setAvailability] = useState('available');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experienceYears: '',
  });
  const fileInputRef = useRef(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState(null);

  useEffect(() => {
    dispatch(fetchGroomerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (groomerProfile?.status) {
      const normalizedStatus = groomerProfile.status.toLowerCase();
      setAvailability(normalizedStatus === 'busy' ? 'unavailable' : normalizedStatus);
    }
  }, [groomerProfile]);

  useEffect(() => {
    if (updateState.success) {
      setShowStatusModal(false);
      setShowEditModal(false);
      setPendingStatus(null);
      dispatch(clearUpdateGroomerState());
      // Refresh profile
      dispatch(fetchGroomerProfile());
    }
  }, [updateState.success, dispatch]);

  const handleStatusClick = (status) => {
    if (status === availability) return;
    setPendingStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    const statusValue = pendingStatus === 'unavailable' ? 'Busy' : 'Available';
    dispatch(updateGroomerProfileThunk({ status: statusValue }));
  };

  const handleEditProfile = () => {
    setEditFormData({
      name: groomerProfile?.users?.name || user?.name || '',
      email: groomerProfile?.users?.email || user?.email || '',
      phone: groomerProfile?.users?.phone || user?.phone || '',
      specialization: groomerProfile?.specialization || '',
      experienceYears: groomerProfile?.experienceYears || '',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      specialization: editFormData.specialization,
      experienceYears: parseInt(editFormData.experienceYears) || undefined,
    };
    dispatch(updateGroomerProfileThunk(payload));
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    dispatch(clearUpdateGroomerState());
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setPendingStatus(null);
    dispatch(clearUpdateGroomerState());
  };

  const statusConfig = {
    available: { label: 'Available', color: 'bg-green-100 text-green-700 border-green-300', dot: 'bg-green-500' },
    Available: { label: 'Available', color: 'bg-green-100 text-green-700 border-green-300', dot: 'bg-green-500' },
    unavailable: { label: 'Unavailable', color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500' },
    Unavailable: { label: 'Unavailable', color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500' },
    busy: { label: 'Unavailable', color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500' },
    Busy: { label: 'Unavailable', color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500' },
  };

  const formatJoinedDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const avatarPath = groomerProfile?.users?.profileImage || user?.profileImage;
  const avatarSrc = profileImageUrl(avatarPath);

  const handlePhotoInputChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      await dispatch(uploadProfilePictureThunk(file)).unwrap();
      dispatch(fetchGroomerProfile());
    } catch (err) {
      setPhotoError(typeof err === 'string' ? err : 'Upload failed');
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      await dispatch(removeProfilePictureThunk()).unwrap();
      dispatch(fetchGroomerProfile());
    } catch (err) {
      setPhotoError(typeof err === 'string' ? err : 'Could not remove photo');
    } finally {
      setPhotoBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-16 text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      )}

      {/* Profile Header */}
      {!loading && (
        <>
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handlePhotoInputChange}
              />
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-purple-100">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-5xl">
                      {groomerProfile?.users?.name?.charAt(0)?.toUpperCase() ||
                        user?.name?.charAt(0)?.toUpperCase() ||
                        'G'}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoBusy}
                    className="text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-100 inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    {photoBusy ? '…' : 'Change photo'}
                  </button>
                  {avatarPath ? (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={photoBusy}
                      className="text-sm font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  ) : null}
                </div>
                {photoError ? <p className="text-xs text-red-600 text-center">{photoError}</p> : null}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {groomerProfile?.users?.name || user?.name || 'Groomer Name'}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${(statusConfig[availability] || statusConfig['available']).color} w-fit mx-auto md:mx-0`}>
                    <span className={`w-2 h-2 rounded-full ${(statusConfig[availability] || statusConfig['available']).dot}`}></span>
                    {(statusConfig[availability] || statusConfig['available']).label}
                  </span>
                </div>
                <p className="text-gray-500 mb-1">
                  {groomerProfile?.users?.email || user?.email || 'groomer@example.com'}
                </p>
                <p className="text-sm text-purple-600 font-semibold mb-1">Groomer</p>
                <p className="text-sm text-gray-500 mb-4">
                  Expertise: {groomerProfile?.specialization || 'Breed-Specific Styling & Spa Treatments'}
                </p>
                <button 
                  onClick={handleEditProfile}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold inline-flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Manage Availability */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Manage Availability</h2>
            <p className="text-sm text-gray-500 mb-5">Set your current availability status so customers know when to book you.</p>
            <div className="flex gap-4">
              {[
                { key: 'available', ...statusConfig.available },
                { key: 'unavailable', ...statusConfig.unavailable },
              ].map(({ key, label, color, dot }) => (
                <button
                  key={key}
                  onClick={() => handleStatusClick(key)}
                  disabled={updateState.loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    availability === key
                      ? `${color} border-current shadow-sm`
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${availability === key ? dot : 'bg-gray-400'}`}></span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Speciality', value: 'Groomer' },
                { label: 'Expertise', value: groomerProfile?.specialization || 'Breed-Specific Styling' },
                { label: 'Experience', value: groomerProfile?.experienceYears ? `${groomerProfile.experienceYears} Years` : 'N/A' },
                { label: 'Joined', value: formatJoinedDate(groomerProfile?.createdAt) },
              ].map(item => (
                <div key={item.label} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{item.label}</p>
                  <p className="text-gray-800 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Email', value: groomerProfile?.users?.email || user?.email || 'groomer@example.com' },
                { label: 'Phone', value: groomerProfile?.users?.phone || user?.phone || '+1 234 567 9002' },
              ].map(item => (
                <div key={item.label} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{item.label}</p>
                  <p className="text-gray-800 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              {updateState.error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-600">{updateState.error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={editFormData.specialization}
                    onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g., Breed-Specific Styling"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={editFormData.experienceYears}
                    onChange={(e) => setEditFormData({ ...editFormData, experienceYears: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Years of experience"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={updateState.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateState.loading}
                >
                  {updateState.loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Confirm Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-sm w-full shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Change Status</h3>
                <p className="text-sm text-gray-500">Update your availability</p>
              </div>
            </div>

            {updateState.error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-600">{updateState.error}</p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-gray-700">
                Are you sure you want to set your status to{' '}
                <span className={`font-bold ${pendingStatus === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                  {(statusConfig[pendingStatus] || statusConfig['available']).label}
                </span>?
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={closeStatusModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
                disabled={updateState.loading}
              >
                Cancel
              </button>
              <button 
                onClick={confirmStatusChange}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updateState.loading}
              >
                {updateState.loading ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}