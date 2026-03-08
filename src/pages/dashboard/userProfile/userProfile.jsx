import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetailsThunk } from '../../../thunks/getUserDetailsThunk';
import { updateUserProfileThunk } from '../../../thunks/updateUserProfileThunk';
import { clearUpdateState } from '../../../feature/updateUserProfileSlice';
import {
  uploadProfilePictureThunk,
  removeProfilePictureThunk,
} from '../../../thunks/uploadProfilePictureThunk';
import { profileImageUrl } from '../../../utils/profileImageUrl';
import { AlertCircle, Smile, PawPrint, X, Edit2, Camera, Trash2 } from 'lucide-react';

export default function UserProfile() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { userDetails, loading, error } = useSelector((state) => state.userDetails);
  const updateState = useSelector((state) => state.updateUserProfile);

  const user = authState?.user?.user;
  const petFromAuth = authState?.user?.pet;
  const fileInputRef = useRef(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
  });
  const [petFormData, setPetFormData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    description: '',
    medicalHistory: '',
  });

  useEffect(() => {
    if (user?.id) {
      const petId = petFromAuth?.id ?? 0;
      dispatch(getUserDetailsThunk({ userId: user.id, petId }));
    }
  }, [dispatch, user?.id, petFromAuth?.id]);

  useEffect(() => {
    if (updateState.success) {
      setShowUserModal(false);
      setShowPetModal(false);
      setSelectedPet(null);
      dispatch(clearUpdateState());
      if (user?.id) {
        dispatch(getUserDetailsThunk({ userId: user.id, petId: petFromAuth?.id ?? 0 }));
      }
    }
  }, [updateState.success, dispatch, user?.id, petFromAuth?.id]);

  const pets = userDetails?.pets || [];
  const userName = userDetails?.name || user?.name || user?.email;
  const avatarPath = userDetails?.profileImage || user?.profileImage;
  const avatarSrc = profileImageUrl(avatarPath);

  const refreshUserDetails = () => {
    if (user?.id) {
      dispatch(getUserDetailsThunk({ userId: user.id, petId: petFromAuth?.id ?? 0 }));
    }
  };

  const handlePhotoInputChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      await dispatch(uploadProfilePictureThunk(file)).unwrap();
      refreshUserDetails();
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
      refreshUserDetails();
    } catch (err) {
      setPhotoError(typeof err === 'string' ? err : 'Could not remove photo');
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleEditUser = () => {
    setUserFormData({
      name: userDetails?.name || user?.name || '',
      email: userDetails?.email || user?.email || '',
    });
    setShowUserModal(true);
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setPetFormData({
      name: pet.name || '',
      age: pet.age || '',
      gender: pet.gender || '',
      weight: pet.weight || '',
      description: pet.description || '',
      medicalHistory: pet.medicalHistory || '',
    });
    setShowPetModal(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfileThunk({
      name: userFormData.name,
      email: userFormData.email,
    }));
  };

  const handlePetSubmit = (e) => {
    e.preventDefault();
    const payload = {
      petId: selectedPet.id,
      breedId: selectedPet.breeds?.id,
      pet: {
        name: petFormData.name,
        age: parseInt(petFormData.age) || undefined,
        gender: petFormData.gender,
        weight: parseFloat(petFormData.weight) || undefined,
        description: petFormData.description,
        medicalHistory: petFormData.medicalHistory,
      },
    };
    dispatch(updateUserProfileThunk(payload));
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    dispatch(clearUpdateState());
  };

  const closePetModal = () => {
    setShowPetModal(false);
    setSelectedPet(null);
    dispatch(clearUpdateState());
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-8 mb-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handlePhotoInputChange}
          />
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-pink-100">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-white font-bold text-5xl">
                  {userName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoBusy}
                className="text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 inline-flex items-center gap-1.5 disabled:opacity-50"
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
            {photoError ? (
              <p className="text-xs text-red-600 text-center max-w-[200px]">{photoError}</p>
            ) : null}
            <p className="text-xs text-gray-400 text-center max-w-[220px]">JPEG, PNG, GIF or WebP, max 2MB</p>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{userName}</h1>
            <p className="text-gray-600 mb-2">{userDetails?.email || user?.email || 'user@example.com'}</p>
            <p className="text-sm text-rose-600 font-semibold mb-4 capitalize">
              {userDetails?.roles?.name || user?.roleName || 'User'}
            </p>
            <button
              onClick={handleEditUser}
              className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors inline-flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Pets Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">My Pets</h2>
          </div>
          <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
            {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}
          </span>
        </div>

        {/* Pets Grid */}
        {pets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const breedData = pet.breeds;
              const profileImage = breedData?.image
                ? `${import.meta.env.VITE_BASE_URL}/${breedData.image}`
                : null;

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Pet Image */}
                  <div className="h-48 bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={pet.name || breedData?.name || 'Pet'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="flex items-center justify-center w-full h-full"><svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>`;
                        }}
                      />
                    ) : (
                      <Smile className="w-20 h-20 text-white" />
                    )}
                  </div>

                  {/* Pet Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {pet.name || 'Unnamed Pet'}
                      </h3>
                      <button
                        onClick={() => handleEditPet(pet)}
                        className="text-rose-600 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Species</span>
                        <span className="text-sm font-semibold text-gray-800 capitalize">
                          {breedData?.species || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Breed</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {breedData?.name || 'N/A'}
                        </span>
                      </div>

                      {pet.age && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Age</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {pet.age} {pet.age === 1 ? 'year' : 'years'}
                          </span>
                        </div>
                      )}

                      {pet.gender && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Gender</span>
                          <span className="text-sm font-semibold text-gray-800 capitalize">
                            {pet.gender}
                          </span>
                        </div>
                      )}

                      {pet.weight && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Weight</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {pet.weight} kg
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pet ID Badge */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Pet ID</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          #{pet.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-12 text-center">
            <Smile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pets Yet</h3>
            <p className="text-gray-500 mb-6">Add your first pet to get started!</p>
            <button className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors">
              Add Pet
            </button>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={closeUserModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="p-6">
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
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeUserModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={updateState.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateState.loading}
                >
                  {updateState.loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {showPetModal && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Edit Pet</h2>
              <button
                onClick={closePetModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePetSubmit} className="p-6">
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
                    value={petFormData.name}
                    onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="Pet name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={petFormData.age}
                    onChange={(e) => setPetFormData({ ...petFormData, age: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="Age"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={petFormData.gender}
                    onChange={(e) => setPetFormData({ ...petFormData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={petFormData.weight}
                    onChange={(e) => setPetFormData({ ...petFormData, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="Weight"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={petFormData.description}
                    onChange={(e) => setPetFormData({ ...petFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
                    placeholder="Pet description"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    value={petFormData.medicalHistory}
                    onChange={(e) => setPetFormData({ ...petFormData, medicalHistory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
                    placeholder="Medical history"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closePetModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={updateState.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateState.loading}
                >
                  {updateState.loading ? 'Updating...' : 'Update Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}