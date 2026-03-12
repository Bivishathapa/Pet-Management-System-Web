import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { authAPI } from '../../utils/api';
import AppSiteNavbar from '../../components/AppSiteNavbar';

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-rose-100 bg-white text-slate-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-200/80 focus:border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const id = searchParams.get('id');
  const hasValidParams = useMemo(() => Boolean(token && id), [token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasValidParams) {
      setError('Reset link is invalid.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      const response = await authAPI.resetPassword({
        id,
        token,
        password,
        confirmPassword,
      });

      setMessage(response?.data?.message || 'Password reset successful.');
      setPassword('');
      setConfirmPassword('');
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to reset password.');
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
              Reset password
            </h1>
            <p className="text-sm text-slate-600">Set your new account password</p>
          </div>

          {!hasValidParams ? (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-5">
              <p className="text-red-700 text-sm">Reset link is invalid or incomplete.</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1.5">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || !hasValidParams}
                className={inputClass}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading || !hasValidParams}
                className={inputClass}
                placeholder="Confirm new password"
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
              disabled={isLoading || !hasValidParams}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium hover:from-rose-700 hover:to-pink-700 shadow-md shadow-rose-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting...
                </span>
              ) : (
                'Reset password'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium text-rose-700 hover:text-pink-700 underline-offset-2 hover:underline"
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
