import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ApplyProfessionalPage() {
  const [form, setForm] = useState({
    desiredRoleId: 3,
    speciality: '',
    experienceYears: '',
    motivation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applications, setApplications] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const loadMyApplications = async () => {
    setListLoading(true);
    try {
      const response = await api.get('/user/professional-application/my');
      setApplications(response?.data?.data || []);
    } catch {
      setApplications([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadMyApplications();
  }, []);

  const handleSubmit = async () => {
    if (!form.speciality.trim() || form.experienceYears === '') {
      setError('Specialization and experience are required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/user/professional-application/apply', {
        desiredRoleId: Number(form.desiredRoleId),
        speciality: form.speciality.trim(),
        experienceYears: Number(form.experienceYears),
        motivation: form.motivation.trim() || null,
      });
      setSuccess('Application submitted successfully.');
      setForm({
        desiredRoleId: 3,
        speciality: '',
        experienceYears: '',
        motivation: '',
      });
      await loadMyApplications();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Apply as Professional</h1>
        <p className="text-gray-600">Submit your profile to work as a Vet or Groomer.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Desired role</label>
            <select
              value={form.desiredRoleId}
              onChange={(e) => setForm({ ...form, desiredRoleId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 text-sm"
              disabled={loading}
            >
              <option value={3}>Veterinarian</option>
              <option value={4}>Groomer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              min="0"
              max="60"
              value={form.experienceYears}
              onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 text-sm"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
          <input
            type="text"
            value={form.speciality}
            onChange={(e) => setForm({ ...form, speciality: e.target.value })}
            placeholder={form.desiredRoleId === 3 ? 'e.g. Small Animal Practice' : 'e.g. Dog Grooming & Styling'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 text-sm"
            disabled={loading}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Why do you want to join? (optional)</label>
          <textarea
            value={form.motivation}
            onChange={(e) => setForm({ ...form, motivation: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 text-sm"
            disabled={loading}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 px-5 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold text-sm disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Applications</h2>
        {listLoading ? (
          <p className="text-sm text-gray-500">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-gray-500">No applications submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="border border-zinc-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">
                    {Number(app.desiredRoleId) === 3 ? 'Veterinarian' : 'Groomer'}
                  </p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700">Specialization: {app.speciality}</p>
                <p className="text-sm text-gray-700">Experience: {app.experienceYears} years</p>
                {app.reviewNote ? <p className="text-sm text-gray-600 mt-1">Review note: {app.reviewNote}</p> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
