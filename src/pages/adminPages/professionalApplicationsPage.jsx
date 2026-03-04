import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ProfessionalApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/Admin/manage/applications');
      setApplications(response?.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReview = async (applicationId, action) => {
    setActionLoadingId(applicationId);
    try {
      await api.patch(`/Admin/manage/applications/${applicationId}/review`, { action });
      await loadApplications();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to review application');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Professional Applications</h1>
        <p className="text-gray-600">Accept or reject user applications for Vet/Groomer positions.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-sm text-gray-500">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Applicant</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Desired Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Specialization</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Experience</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-800">{app.user?.name || 'Unknown'}</p>
                      <p className="text-zinc-500">{app.user?.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{Number(app.desiredRoleId) === 3 ? 'Veterinarian' : 'Groomer'}</td>
                    <td className="px-4 py-3 text-zinc-700">{app.speciality}</td>
                    <td className="px-4 py-3 text-zinc-700">{app.experienceYears} years</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {app.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReview(app.id, 'accept')}
                            disabled={actionLoadingId === app.id}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReview(app.id, 'reject')}
                            disabled={actionLoadingId === app.id}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-500">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
