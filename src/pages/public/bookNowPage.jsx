import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createNewAppointment } from '../../components/createNewAppointment';
import AppSiteNavbar from '../../components/AppSiteNavbar';
import { CheckCircle, Search, Star } from 'lucide-react';

function LoginRequiredModal({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-zinc-200">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mb-2">Login required</h2>
          <p className="text-sm text-slate-600 mb-6">
            You can browse and fill appointment details, but please login to complete booking.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 px-4 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="w-1/2 py-2.5 px-4 rounded-lg text-white text-sm font-medium bg-rose-600 hover:bg-rose-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookNowPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  const typeParam = searchParams.get('type') === 'groomer' ? 'grooming' : 'veterinary';
  const professionalIdParam = searchParams.get('professionalId') || '';

  const {
    formData,
    currentStep,
    searchTerm,
    userPets,
    appointmentTypes,
    timeSlots,
    searchedProfessionals,
    vetsLoading,
    groomersLoading,
    createLoading,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    setSearchTerm,
    isStepValid,
  } = createNewAppointment({
    guestMode: true,
    initialType: typeParam,
    initialProfessionalId: professionalIdParam,
    onGuestSubmit: () => setShowLoginModal(true),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F2EA] via-[#EFE8DC] to-[#FFFDF9] text-[#2F3A34]">
      <AppSiteNavbar />

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => navigate('/login')}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Book appointment</h1>
          <p className="text-sm text-slate-600">Same booking flow. Login is required only to complete final booking.</p>
        </div>

        <div className="bg-[#FFFDF9] rounded-[28px] border border-[#DED7CB] shadow-sm p-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  <span className={`mt-2 text-sm font-semibold ${currentStep >= step ? 'text-rose-600' : 'text-gray-500'}`}>
                    {step === 1 && 'Select Pet'}
                    {step === 2 && 'Select Type'}
                    {step === 3 && 'Date & Time'}
                    {step === 4 && 'Choose Professional'}
                  </span>
                </div>
                {index < 3 && <div className={`flex-1 h-1 mx-4 rounded transition-all ${currentStep > step ? 'bg-rose-600' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="bg-[#FFFDF9] rounded-[28px] border border-[#DED7CB] shadow-sm p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Select your pet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPets.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => handleInputChange('petId', pet.id)}
                  className={`p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                    formData.petId === pet.id ? 'border-rose-600 bg-rose-50' : 'border-[#DED7CB] bg-white hover:border-rose-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
                  <p className="text-sm text-gray-600">Guest preview mode</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-[#FFFDF9] rounded-[28px] border border-[#DED7CB] shadow-sm p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Appointment type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointmentTypes.map((type) => (
                <div
                  key={type.value}
                  onClick={() => handleInputChange('appointmentType', type.value)}
                  className={`p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                    formData.appointmentType === type.value ? 'border-rose-600 bg-rose-50' : 'border-[#DED7CB] bg-white hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{type.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{type.label}</h3>
                      <p className="text-sm text-gray-600">Professional care for your pet</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-[#FFFDF9] rounded-[28px] border border-[#DED7CB] shadow-sm p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Date and time</h2>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-[#DED7CB] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Time Slot</label>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleInputChange('time', slot)}
                    className={`p-3 rounded-lg border font-semibold transition-all hover:shadow-md ${
                      formData.time === slot ? 'border-rose-600 bg-rose-600 text-white' : 'border-[#DED7CB] text-gray-700 hover:border-rose-300 bg-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-[#FFFDF9] rounded-[28px] border border-[#DED7CB] shadow-sm p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Choose a professional</h2>
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-[#DED7CB] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-800"
              />
              <Search className="w-6 h-6 text-gray-400 absolute left-4 top-3.5" />
            </div>

            {(vetsLoading || groomersLoading) && <p className="text-gray-600">Loading professionals...</p>}

            {!vetsLoading && !groomersLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {searchedProfessionals.map((professional) => (
                  <div
                    key={professional.id}
                    onClick={() => handleInputChange('professionalId', professional.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                      formData.professionalId === professional.id ? 'border-rose-600 bg-rose-50' : 'border-[#DED7CB] bg-white hover:border-rose-300'
                    }`}
                  >
                    <h3 className="text-lg font-bold text-gray-800">{professional.name}</h3>
                    <p className="text-sm text-gray-600">{professional.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-800">{professional.rating ?? 'Not rated yet'}</span>
                      <span className="text-sm text-gray-600">• {professional.experience}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={`flex mt-8 ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-600 text-white hover:bg-gray-700"
            >
              Previous
            </button>
          ) : null}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                isStepValid() ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isStepValid() || createLoading}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                isStepValid() && !createLoading ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Login to Complete Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
