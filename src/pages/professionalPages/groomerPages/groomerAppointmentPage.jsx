import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroomerAppointments } from '../../../thunks/listAppointmentGroomerThunk';
import { updateGroomerAppointmentStatus } from '../../../thunks/setAppointmentStatusGroomerThunk';
import { clearStatusUpdateError } from '../../../feature/setAppointmentStatusGroomerSlice';
import { fetchGroomerProfile } from '../../../thunks/getGroomerProfileThunk';

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

function NotesModal({ notes, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Customer Notes</h3>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 mb-5">
          <p className="text-gray-700 text-sm leading-relaxed">{notes || 'No notes available'}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function EditModal({ appointment, onClose, onSave, isSaving }) {
  const [status, setStatus] = useState(appointment.status || 'pending');

  const handleSave = () => {
    onSave(status);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Update Appointment Status</h3>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GroomerAppointmentPage() {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.groomerAppointments);
  const { loading: updateLoading, error: updateError, success: updateSuccess } = useSelector((state) => state.setAppointmentStatusGroomer);
  const { profile: groomerProfile, loading: profileLoading } = useSelector((state) => state.groomerProfile);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [notesModal, setNotesModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchGroomerProfile());
    dispatch(fetchGroomerAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setSuccessMessage('Appointment status updated successfully!');
      setEditModal(null);
      
      const timer = setTimeout(() => {
        setSuccessMessage('');
        dispatch(clearStatusUpdateError());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  const filtered = appointments.filter((apt) => {
    const customerName = apt.user?.name || '';
    const petName = apt.pet?.name || '';
    const appointmentType = apt.appointmentType || '';
    
    return (
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointmentType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSaveEdit = async (status) => {
    if (!groomerProfile?.id) {
      console.error('Groomer profile not loaded. Groomer ID:', groomerProfile?.id);
      alert('Unable to update appointment. Groomer profile not loaded. Please refresh the page.');
      return;
    }

    if (!editModal?.id) {
      console.error('Appointment ID missing. Appointment:', editModal);
      alert('Unable to update appointment. Appointment ID is missing.');
      return;
    }

    try {
      await dispatch(updateGroomerAppointmentStatus({
        groomerId: groomerProfile.id,
        appointmentId: editModal.id,
        status: status,
      })).unwrap();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const totalToday = appointments.filter(a => a.appointmentDate === today).length;
  const totalConfirmed = appointments.filter(a => a.status === 'confirmed').length;
  const totalPending = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Grooming Appointments</h1>
        <p className="text-gray-600">Manage and track all your grooming sessions</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Update Error Message */}
      {updateError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{updateError}</span>
          <button 
            onClick={() => dispatch(clearStatusUpdateError())}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Profile Loading Warning */}
      {profileLoading && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Loading groomer profile...</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Today', value: totalToday, color: 'bg-indigo-100 text-indigo-700' },
          { label: 'Confirmed', value: totalConfirmed, color: 'bg-green-100 text-green-700' },
          { label: 'Pending', value: totalPending, color: 'bg-yellow-100 text-yellow-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">
            <div className={`px-3 py-2 rounded-xl text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Appointments</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by customer, pet name, or service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading appointments...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Pet Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Age</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Service Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Description</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 font-medium">
                          {searchTerm ? 'No appointments found matching your search' : 'No appointments found'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((apt, index) => {
                    const customerName = apt.user?.name || 'N/A';
                    const customerEmail = apt.user?.email || 'N/A';
                    const petName = apt.pet?.name || 'N/A';
                    const petAge = apt.pet?.age || 'N/A';
                    const serviceType = apt.appointmentType || apt.serviceType || 'N/A';
                    const description = apt.description || '';
                    
                    return (
                      <tr key={apt.id} className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {customerName !== 'N/A' ? customerName.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                            </div>
                            <span className="text-sm font-semibold text-gray-800">{customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{customerEmail}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-800">{petName}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {petAge !== 'N/A' ? `${petAge} yr${petAge !== 1 ? 's' : ''}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 capitalize">{serviceType}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatDate(apt.appointmentDate)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{formatTime(apt.time)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[apt.status] || 'bg-gray-100 text-gray-700'}`}>
                            {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {description ? (
                            <button
                              onClick={() => setNotesModal(description)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-xs font-semibold"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No description</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setEditModal(apt)}
                            disabled={apt.status === 'completed' || apt.status === 'cancelled' || !groomerProfile?.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold ${
                              apt.status === 'completed' || apt.status === 'cancelled' || !groomerProfile?.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {apt.status === 'completed' || apt.status === 'cancelled' ? 'Locked' : !groomerProfile?.id ? 'Loading...' : 'Edit'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {notesModal && <NotesModal notes={notesModal} onClose={() => setNotesModal(null)} />}

      {/* Edit Modal */}
      {editModal && (
        <EditModal
          appointment={editModal}
          onClose={() => setEditModal(null)}
          onSave={handleSaveEdit}
          isSaving={updateLoading}
        />
      )}
    </div>
  );
}