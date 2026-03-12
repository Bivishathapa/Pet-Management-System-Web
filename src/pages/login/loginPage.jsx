import React from 'react';
import { useLogin } from '../../components/userLogin';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import AppSiteNavbar from '../../components/AppSiteNavbar';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import authImage from '../../assets/Login and register.png';

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-[#cfc4b5] bg-white text-slate-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#5E7A64]/30 focus:border-[#5E7A64] disabled:opacity-50 disabled:cursor-not-allowed';

export default function LoginPage({ onNavigateToRegister, onNavigateToForgotPassword }) {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50/80 to-rose-100/50">
      <AppSiteNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-xl border border-[#cfc4b5] shadow-lg shadow-black/5 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="hidden md:block">
            <img
              src={authImage}
              alt="PetPerfect login"
              className="w-full h-full object-cover min-h-[640px]"
            />
          </div>
          <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent mb-1">
              PetPerfect
            </h1>
            <p className="text-sm text-slate-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-5">
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
                required
                disabled={isLoading}
                className={inputClass}
                placeholder="you@example.com"
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
                  required
                  disabled={isLoading}
                  className={inputClass + ' pr-11'}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-slate-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  disabled={isLoading}
                  className="text-xs font-medium text-rose-700 hover:text-pink-700 underline-offset-2 hover:underline disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-lg border border-[#cfc4b5] bg-white text-slate-900 text-sm font-medium hover:bg-[#F6F2EA] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <>
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-slate-500">or</span>
                  </div>
                </div>
                <GoogleSignInButton disabled={isLoading} />
              </>
            ) : null}
          </div>

          <p className="text-center mt-8 text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              disabled={isLoading}
              className="font-medium text-rose-700 hover:text-pink-700 underline-offset-2 hover:underline disabled:opacity-50"
            >
              Sign up
            </button>
          </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
