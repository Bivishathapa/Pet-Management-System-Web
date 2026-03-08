import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import AppSiteNavbar from '../../../components/AppSiteNavbar';
import { fetchVets } from '../../../thunks/listVetsThunk';
import { fetchGroomers } from '../../../thunks/listGroomersThunk';
import { Search, AlertCircle, Star, Briefcase, Frown } from 'lucide-react';
import { isProfessionalAvailableForListing } from '../../../utils/professionalAvailability';

export default function ListProfessionalPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const showPublicNavbar = !location.pathname.startsWith('/dashboard');

  const { vets = [], loading: vetsLoading, error: vetsError } = useSelector((state) => state.vets);
  const { groomers = [], loading: groomersLoading, error: groomersError } = useSelector((state) => state.groomers);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userData = user?.data || user;
  const roleId = userData?.user?.roleId;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') === 'groomer' ? 'groomer' : 'vet');
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  useEffect(() => {
    dispatch(fetchVets());
    dispatch(fetchGroomers());
  }, [dispatch]);

  const transformedVets = Array.isArray(vets) ? vets.map(vet => ({
    id: vet.id,
    name: vet.users?.name || 'Unknown',
    specialty: vet.specialization,
    rating: typeof vet.rating === 'number' ? vet.rating : null,
    experience: `${vet.experienceYears} years`,
    avatar: (vet.users?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
    available: isProfessionalAvailableForListing(vet)
  })) : [];

  const transformedGroomers = Array.isArray(groomers) ? groomers.map(groomer => ({
    id: groomer.id,
    name: groomer.users?.name || 'Unknown',
    specialty: groomer.specialization,
    rating: typeof groomer.rating === 'number' ? groomer.rating : null,
    experience: `${groomer.experienceYears} years`,
    avatar: (groomer.users?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
    available: isProfessionalAvailableForListing(groomer)
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

  const handleBookClick = (professionalId) => {
    navigate(`/book-now?type=${selectedType}&professionalId=${professionalId}`);
  };

  return (
    <>
      {showPublicNavbar ? <AppSiteNavbar /> : null}
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Available Professionals</h1>
        <p className="text-gray-600">Browse and connect with our pet care experts</p>
      </div>

      {/* Toggle Slider */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <div className="flex items-center justify-center gap-4">
          <span className={`text-lg font-semibold transition-colors ${selectedType === 'vet' ? 'text-rose-600' : 'text-gray-400'}`}>
            Veterinarians
          </span>
          <button
            onClick={() => setSelectedType(selectedType === 'vet' ? 'groomer' : 'vet')}
            className={`relative w-20 h-10 rounded-full transition-colors ${
              selectedType === 'vet' ? 'bg-rose-600' : 'bg-pink-600'
            }`}
          >
            <div
              className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform ${
                selectedType === 'vet' ? 'left-1' : 'translate-x-10 left-1'
              }`}
            />
          </button>
          <span className={`text-lg font-semibold transition-colors ${selectedType === 'groomer' ? 'text-pink-600' : 'text-gray-400'}`}>
            Groomers
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Professionals</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading {selectedType === 'vet' ? 'veterinarians' : 'groomers'}...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6">
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
            <div key={professional.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 hover:border-zinc-300 hover:shadow-md transition-all">
              {/* Professional Avatar and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                    selectedType === 'vet'
                      ? 'bg-rose-600'
                      : 'bg-pink-600'
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
                  <span className="text-sm font-semibold text-gray-800">
                    {professional.rating !== null ? professional.rating : 'Not rated yet'}
                  </span>
                  <span className="text-sm text-gray-600">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-rose-500" />
                  <span className="text-sm text-gray-600">{professional.experience} experience</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProfessional(professional)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition-colors font-semibold"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => handleBookClick(professional.id)}
                  className={`w-full text-white px-4 py-2 rounded-lg transition-colors font-semibold ${
                    selectedType === 'vet'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-pink-600 hover:bg-pink-700'
                  }`}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredProfessionals.length === 0 && !loading && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-12 text-center">
          <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No {selectedType === 'vet' ? 'Veterinarians' : 'Groomers'} Found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {selectedProfessional && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedProfessional.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{selectedProfessional.specialty}</p>
            <div className="space-y-2 text-sm text-slate-700 mb-6">
              <p><span className="font-semibold">Service:</span> {selectedType === 'vet' ? 'Veterinary services, vaccination, and general check-ups' : 'Grooming services and hygiene care'}</p>
              <p><span className="font-semibold">Experience:</span> {selectedProfessional.experience}</p>
              <p><span className="font-semibold">Rating:</span> {selectedProfessional.rating ?? 'Not rated yet'}</p>
              <p><span className="font-semibold">Status:</span> {selectedProfessional.available ? 'Available' : 'Busy'}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedProfessional(null)}
                className="w-1/2 px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleBookClick(selectedProfessional.id);
                  setSelectedProfessional(null);
                }}
                className={`w-1/2 text-white px-4 py-2 rounded-lg transition-colors font-semibold ${
                  selectedType === 'vet' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-pink-600 hover:bg-pink-700'
                }`}
              >
                Book Now
              </button>
            </div>
            {!isAuthenticated && (
              <p className="text-xs text-slate-500 mt-3">You can continue booking, but login is required at final confirmation.</p>
            )}
          </div>
        </div>
      )}
 </div>
    </>
  );
}