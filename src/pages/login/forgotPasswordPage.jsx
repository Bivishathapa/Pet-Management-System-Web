import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { authAPI } from '../../utils/api';
import AppSiteNavbar from '../../components/AppSiteNavbar';

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-rose-100 bg-white text-slate-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-200/80 focus:border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed';

export default function ForgotPasswordPage({ onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      setMessage('');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      const response = await authAPI.forgotPassword({ email });
      setMessage(response?.data?.message || 'If that email exists, a reset link has been sent.');
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50/80 to-rose-100/50">
      <AppSiteNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-rose-100 shadow-lg shadow-rose-100/50 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent mb-1">
              Forgot password
            </h1>
            <p className="text-sm text-slate-600">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            {message ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-700 text-sm">{message}</p>
              </div>
            ) : null}

            {error ? (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium hover:from-rose-700 hover:to-pink-700 shadow-md shadow-rose-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send reset link'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-600">
            Remember your password?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              disabled={isLoading}
              className="font-medium text-rose-700 hover:text-pink-700 underline-offset-2 hover:underline disabled:opacity-50"
            >
              Back to sign in
            </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
