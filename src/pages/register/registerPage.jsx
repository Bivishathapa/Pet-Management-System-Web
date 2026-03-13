import React from 'react';
import useUserRegistration from '../../components/userRegistration';

function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-8 max-w-md w-full border-2 border-indigo-200">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. You can now login to your account.
          </p>
          
          {/* OK Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl text-white font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage({ onNavigateToLogin }) {
  const {
    formData,
    showPassword,
    setShowPassword,
    displayError,
    success,
    isLoading,
    breedsLoading,
    registerLoading,
    speciesList,
    availableBreeds,
    handleChange,
    handleSubmit,
    showSuccessModal,
    handleModalClose
  } = useUserRegistration(onNavigateToLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-300 via-indigo-300 to-purple-300 py-12 px-4 relative overflow-hidden">
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-2/3 w-3 h-3 bg-white rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full max-w-2xl p-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-white">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-2xl animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold mb-3 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-700 text-lg font-medium">Join us and start your journey</p>
          </div>

          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-center font-medium">
              {displayError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-2 text-indigo-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2 text-indigo-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm"
                placeholder="email@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold mb-2 text-indigo-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm"
                placeholder="+1 (555) 123-4567"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2 text-indigo-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 pr-12 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                /> 
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="species" className="block text-sm font-bold mb-2 text-indigo-700">
                Pet Species
              </label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm"
                disabled={isLoading}
                required
              >
                <option value="">
                  {breedsLoading ? 'Loading species...' : 'Select a species'}
                </option>
                {speciesList.map((species) => (
                  <option key={species} value={species}>
                    {species}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-bold mb-2 text-indigo-700">
                Breed / Type
              </label>
              <select
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm"
                disabled={!formData.species || isLoading}
                required
              >
                <option value="">
                  {!formData.species ? 'Select a species first' : 'Select a breed'}
                </option>
                {availableBreeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-bold mb-2 text-indigo-700">
                Pet Age (in years)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm"
                placeholder="Enter pet's age (e.g., 2.5)"
                required
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-white font-bold text-lg bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {registerLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <p className="text-center mt-8 text-base text-gray-700 font-medium">
            Already have an account?{' '}
            <button 
              onClick={onNavigateToLogin}
              className="font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 underline decoration-2 underline-offset-2 transition-all"
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}