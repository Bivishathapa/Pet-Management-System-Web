import React from 'react';
import { createNewAppointment } from '../../../components/createNewAppointment';
import { CheckCircle, Search, Star } from 'lucide-react';

function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl p-8 max-w-md w-full border-2 border-indigo-200">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Appointment Request Successfull!
          </h2>
          <p className="text-gray-600 mb-6">
            Your appointment request has been successfully sent. Please wait for the confirmation. ThankYou!!
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl text-white font-bold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GetAppointmentPage() {
  const {
    formData,
    currentStep,
    searchTerm,
    userPets,
    appointmentTypes,
    timeSlots,
    searchedProfessionals,
    showSuccessModal,
    vetsLoading,
    groomersLoading,
    createLoading,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    setSearchTerm,
    isStepValid,
    handleModalClose
  } = createNewAppointment();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Get Appointment</h1>
        <p className="text-gray-600">Schedule a new appointment for your pet</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <span className={`mt-2 text-sm font-semibold ${
                  currentStep >= step ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Select Pet'}
                  {step === 2 && 'Select Type'}
                  {step === 3 && 'Date & Time'}
                  {step === 4 && 'Choose Professional'}
                </span>
              </div>
              {index < 3 && (
                <div className={`flex-1 h-1 mx-4 rounded transition-all ${
                  currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Select Pet */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Pet</h2>
          {userPets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't added any pets yet.</p>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Add a Pet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPets.map(pet => (
                <div
                  key={pet.id}
                  onClick={() => handleInputChange('petId', pet.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    formData.petId === pet.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                      {pet.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
                      <p className="text-sm text-gray-600">{pet.species} • {pet.breed}</p>
                      <p className="text-sm text-gray-500">{pet.age} years old</p>
                    </div>
                    {formData.petId === pet.id && (
                      <CheckCircle className="w-6 h-6 text-indigo-600 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Appointment Type */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Appointment Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointmentTypes.map(type => (
              <div
                key={type.value}
                onClick={() => handleInputChange('appointmentType', type.value)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                  formData.appointmentType === type.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{type.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{type.label}</h3>
                    <p className="text-sm text-gray-600">Professional care for your pet</p>
                  </div>
                  {formData.appointmentType === type.value && (
                    <CheckCircle className="w-6 h-6 text-indigo-600 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Select Date and Time */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Date & Time</h2>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Time Slot</label>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => handleInputChange('time', slot)}
                  className={`p-3 rounded-lg border-2 font-semibold transition-all hover:shadow-md ${
                    formData.time === slot
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Any special requirements or notes..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
            />
          </div>
        </div>
      )}

      {/* Step 4: Search and Select Professional */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Professional</h2>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
              />
              <Search className="w-6 h-6 text-gray-400 absolute left-4 top-3.5" />
            </div>
          </div>

          {/* Loading State */}
          {(vetsLoading || groomersLoading) && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading professionals...</p>
            </div>
          )}

          {/* Professionals List */}
          {!vetsLoading && !groomersLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {searchedProfessionals.map(professional => (
                <div
                  key={professional.id}
                  onClick={() => handleInputChange('professionalId', professional.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    formData.professionalId === professional.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {professional.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{professional.name}</h3>
                      <p className="text-sm text-gray-600">{professional.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-800">{professional.rating}</span>
                        <span className="text-sm text-gray-600">• {professional.experience}</span>
                      </div>
                    </div>
                    {formData.professionalId === professional.id && (
                      <CheckCircle className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchedProfessionals.length === 0 && !vetsLoading && !groomersLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600">No professionals found for this appointment type</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isStepValid()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isStepValid() || createLoading}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isStepValid() && !createLoading
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {createLoading ? 'Booking...' : 'Book Appointment'}
          </button>
        )}
      </div>
    </div>
  );
}