import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVets } from '../../../thunks/listVetsThunk';
import { fetchGroomers } from '../../../thunks/listGroomersThunk';
import { Search, AlertCircle, Star, Briefcase, Frown } from 'lucide-react';

export default function ListProfessionalPage() {
  const dispatch = useDispatch();

  const { vets = [], loading: vetsLoading, error: vetsError } = useSelector((state) => state.vets);
  const { groomers = [], loading: groomersLoading, error: groomersError } = useSelector((state) => state.groomers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('vet');

  useEffect(() => {
    dispatch(fetchVets());
    dispatch(fetchGroomers());
  }, [dispatch]);

  const transformedVets = Array.isArray(vets) ? vets.map(vet => ({
    id: vet.id,
    name: vet.users?.name || 'Unknown',
    specialty: vet.specialization,
    rating: vet.rating || 4.5,
    experience: `${vet.experienceYears} years`,
    avatar: (vet.users?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
    available: vet.status === 'available'
  })) : [];

  const transformedGroomers = Array.isArray(groomers) ? groomers.map(groomer => ({
    id: groomer.id,
    name: groomer.users?.name || 'Unknown',
    specialty: groomer.specialization,
    rating: groomer.rating || 4.5,
    experience: `${groomer.experienceYears} years`,
    avatar: (groomer.users?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
    available: groomer.status === 'available'
  })) : [];

  const currentList = selectedType === 'vet' ? transformedVets : transformedGroomers;
  const loading = selectedType === 'vet' ? vetsLoading : groomersLoading;
  const error = selectedType === 'vet' ? vetsError : groomersError;

  const filteredProfessionals = currentList.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRetry = () => {
    if (selectedType === 'vet') dispatch(fetchVets());
    else dispatch(fetchGroomers());
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Professionals</h1>
        <p className="text-gray-600">Browse and connect with our pet care experts</p>
      </div>

      {/* Toggle Slider */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-4">
          <span className={`text-lg font-semibold transition-colors ${selectedType === 'vet' ? 'text-indigo-600' : 'text-gray-400'}`}>
            Veterinarians
          </span>
          <button
            onClick={() => setSelectedType(selectedType === 'vet' ? 'groomer' : 'vet')}
            className={`relative w-20 h-10 rounded-full transition-colors ${
              selectedType === 'vet' ? 'bg-indigo-600' : 'bg-purple-600'
            }`}
          >
            <div
              className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform ${
                selectedType === 'vet' ? 'left-1' : 'translate-x-10 left-1'
              }`}
            />
          </button>
          <span className={`text-lg font-semibold transition-colors ${selectedType === 'groomer' ? 'text-purple-600' : 'text-gray-400'}`}>
            Groomers
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Professionals</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading {selectedType === 'vet' ? 'veterinarians' : 'groomers'}...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">
                Error Loading {selectedType === 'vet' ? 'Veterinarians' : 'Groomers'}
              </h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Professionals Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map(professional => (
            <div key={professional.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              {/* Professional Avatar and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                    selectedType === 'vet'
                      ? 'bg-linear-to-br from-indigo-500 to-purple-500'
                      : 'bg-linear-to-br from-purple-500 to-pink-500'
                  }`}>
                    {professional.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{professional.name}</h3>
                    <p className="text-sm text-gray-600">{professional.specialty}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  professional.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {professional.available ? 'Available' : 'Busy'}
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800">{professional.rating}</span>
                  <span className="text-sm text-gray-600">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm text-gray-600">{professional.experience} experience</span>
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full text-white px-4 py-2 rounded-lg transition-colors font-semibold ${
                selectedType === 'vet'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredProfessionals.length === 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No {selectedType === 'vet' ? 'Veterinarians' : 'Groomers'} Found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}