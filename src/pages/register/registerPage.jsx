import React from 'react';
import useUserRegistration from '../../components/userRegistration';
import AppSiteNavbar from '../../components/AppSiteNavbar';
import authImage from '../../assets/Login and register.png';

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-rose-100 bg-white text-slate-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-200/80 focus:border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed';

function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full border border-zinc-200">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Registration successful</h2>
          <p className="text-sm text-slate-600 mb-6">
            Your account has been created. You can sign in now.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 transition-all"
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
    handleModalClose,
  } = useUserRegistration(onNavigateToLogin);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50/80 to-rose-100/50">
      <AppSiteNavbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />

      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-xl border border-rose-100 shadow-lg shadow-rose-100/50 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="hidden md:block">
            <img
              src={authImage}
              alt="PetPerfect register"
              className="w-full h-full object-cover min-h-[760px]"
            />
          </div>
          <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent mb-1">
              Create account
            </h1>
            <p className="text-sm text-slate-600">Join PetPerfect</p>
          </div>

          {displayError && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {displayError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-slate-700 mb-1.5">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+1 555 123 4567"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass + ' pr-12'}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-slate-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="petName" className="block text-xs font-medium text-slate-700 mb-1.5">
                Pet name
              </label>
              <input
                id="petName"
                name="petName"
                type="text"
                value={formData.petName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your pet name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="species" className="block text-xs font-medium text-slate-700 mb-1.5">
                Pet species
              </label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                className={inputClass}
                disabled={isLoading}
                required
              >
                <option value="">{breedsLoading ? 'Loading…' : 'Select species'}</option>
                {speciesList.map((species) => (
                  <option key={species} value={species}>
                    {species}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-xs font-medium text-slate-700 mb-1.5">
                Breed
              </label>
              <select
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className={inputClass}
                disabled={!formData.species || isLoading}
                required
              >
                <option value="">{!formData.species ? 'Select species first' : 'Select breed'}</option>
                {availableBreeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="age" className="block text-xs font-medium text-slate-700 mb-1.5">
                Pet age (years)
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
                className={inputClass}
                placeholder="e.g. 2.5"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium hover:from-rose-700 hover:to-pink-700 shadow-md shadow-rose-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {registerLoading ? 'Creating account…' : 'Create account'}
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-medium text-rose-700 hover:text-pink-700 underline-offset-2 hover:underline disabled:opacity-50"
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
