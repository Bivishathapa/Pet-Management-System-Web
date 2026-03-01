import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Info, CheckCircle, XCircle } from 'lucide-react';
import { addPet } from '../../thunks/addPetsThunk';
import { resetPetState } from '../../feature/addPetsSlice';
import { fetchBreeds } from '../../thunks/getAnimalBreedThunk';
import { getUserDetailsThunk } from '../../thunks/getUserDetailsThunk';

export default function AddPets() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.addPet);
  const { speciesList, breedsBySpecies, loading: breedsLoading } = useSelector((state) => state.breed);
  const authUserId = useSelector((state) => state.auth?.user?.user?.id);

  const [formData, setFormData] = useState({
    name: '',
    petType: '',
    breedId: '',
    age: '',
    gender: '',
    weight: '',
    description: '',
    medicalHistory: '',
  });

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    dispatch(fetchBreeds());
  }, [dispatch]);

  useEffect(() => {
    if (success || error) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        if (success) {
          dispatch(resetPetState());
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'petType') {
      setFormData(prev => ({
        ...prev,
        petType: value,
        breedId: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.breedId) {
      alert('Please select a breed');
      return;
    }

    const petData = {
      name: formData.name || null,
      petType: formData.petType || null,
      breedId: parseInt(formData.breedId),
      age: formData.age ? parseFloat(formData.age) : null,
      gender: formData.gender || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      description: formData.description || null,
      medicalHistory: formData.medicalHistory || null,
    };

    try {
      const result = await dispatch(addPet({ petData })).unwrap();
      const newPetId = result?.data?.id;
      if (newPetId && authUserId) {
        dispatch(getUserDetailsThunk({ userId: authUserId, petId: newPetId }));
      }
      setFormData({
        name: '',
        petType: '',
        breedId: '',
        age: '',
        gender: '',
        weight: '',
        description: '',
        medicalHistory: '',
      });
    } catch (err) {
      console.error('Failed to add pet:', err);
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      petType: '',
      breedId: '',
      age: '',
      gender: '',
      weight: '',
      description: '',
      medicalHistory: '',
    });
    dispatch(resetPetState());
  };

  const availableBreeds = formData.petType && breedsBySpecies[formData.petType]
    ? breedsBySpecies[formData.petType]
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Success/Error Notification */}
      {showNotification && (success || error) && (
        <div className={`fixed top-4 right-4 z-50 max-w-md ${success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-xl p-4 shadow-lg animate-slide-in`}>
          <div className="flex items-start space-x-3">
            {success ? (
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 mt-0.5 shrink-0" />
            )}
            <div>
              <h3 className={`font-semibold ${success ? 'text-green-900' : 'text-red-900'} mb-1`}>
                {success ? 'Pet Added Successfully!' : 'Error Adding Pet'}
              </h3>
              <p className={`text-sm ${success ? 'text-green-700' : 'text-red-700'}`}>
                {success ? 'Your pet has been registered successfully.' : error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Add your pet</h1>
        <p className="text-sm text-slate-600">Register your companion</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pet Name & Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pet Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors"
                placeholder="Enter pet's name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pet Type *</label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors"
                required
                disabled={loading || breedsLoading}
              >
                <option value="">Select pet type</option>
                {speciesList?.map((species) => (
                  <option key={species} value={species}>
                    {species.charAt(0).toUpperCase() + species.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Breed & Age Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Breed *</label>
              <select
                name="breedId"
                value={formData.breedId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors"
                required
                disabled={loading || breedsLoading || !formData.petType}
              >
                <option value="">Select breed</option>
                {availableBreeds?.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </select>
              {!formData.petType && (
                <p className="text-xs text-gray-500 mt-1">Please select a pet type first</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors"
                placeholder="Enter age"
                min="0"
                step="0.1"
                disabled={loading}
              />
            </div>
          </div>

          {/* Gender & Weight Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors"
                disabled={loading}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors"
                placeholder="Enter weight"
                min="0"
                step="0.1"
                disabled={loading}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description/Color/Markings</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors"
              placeholder="Describe color, markings, or other identifying features"
              disabled={loading}
            />
          </div>

          {/* Medical History */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Medical History</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors resize-none"
              placeholder="Any medical conditions, allergies, or special notes..."
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-rose-600 text-white text-sm font-medium rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Pet...
                </span>
              ) : (
                'Add Pet'
              )}
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Important Information</h3>
            <p className="text-sm text-gray-600">
              Make sure to provide accurate information about your pet for better care and service. You can always update this information later from your profile. The breed field is required for registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}