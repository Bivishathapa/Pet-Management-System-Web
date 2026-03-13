import React from 'react';
import { useLogin } from '../../components/userLogin';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage({ onNavigateToRegister }) {
  const {
    formData,
    showPassword,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-300 via-indigo-300 to-purple-300 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full opacity-80 animate-pulse" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-2/3 w-3 h-3 bg-white rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="w-full max-w-2xl p-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-white">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-2xl animate-pulse">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 6c0-1.1-.9-2-2-2h-2c0-1.1-.9-2-2-2s-2 .9-2 2H8c-1.1 0-2 .9-2 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2zm-6-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm8 16H4V8h2v2h12V8h2v12z"/>
                <circle cx="9" cy="13" r="1.5"/>
                <circle cx="15" cy="13" r="1.5"/>
                <path d="M12 17.5c1.38 0 2.63-.56 3.54-1.47l-1.41-1.41c-.56.56-1.33.88-2.13.88s-1.57-.32-2.13-.88l-1.41 1.41c.9.91 2.16 1.47 3.54 1.47z"/>
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold mb-2 pb-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PetPerfect
            </h1>
            <p className="text-gray-700 text-lg font-medium">Sign in to continue your journey</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          <div className="space-y-6">
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
                required
                disabled={isLoading}
                className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
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
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all bg-linear-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
                  disabled={isLoading}
                >
                  {showPassword
                    ? <EyeOff className="w-5 h-5" />
                    : <Eye className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-white font-bold text-lg bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <p className="text-center mt-8 text-base text-gray-700 font-medium">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToRegister}
              disabled={isLoading}
              className="font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 underline decoration-2 underline-offset-2 transition-all disabled:opacity-50"
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}