import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroomerAppointments } from '../../../thunks/listAppointmentGroomerThunk';
import { updateGroomerAppointmentStatus } from '../../../thunks/setAppointmentStatusGroomerThunk';
import { clearStatusUpdateError } from '../../../feature/setAppointmentStatusGroomerSlice';
import { fetchGroomerProfile } from '../../../thunks/getGroomerProfileThunk';

const statusColors = {
  confirmed: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600/12',
  pending: 'bg-amber-50 text-amber-950 ring-1 ring-amber-600/10',
  cancelled: 'bg-red-50 text-red-900 ring-1 ring-red-600/10',
  completed: 'bg-sky-50 text-sky-950 ring-1 ring-sky-600/10',
};

const paymentStatusColors = {
  paid: 'bg-green-50 text-green-800 ring-1 ring-green-600/20',
  pending: 'bg-amber-50 text-amber-900 ring-1 ring-amber-600/20',
  unpaid: 'bg-red-50 text-red-800 ring-1 ring-red-600/20',
};

function NotesModal({ notes, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-md bg-zinc-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-900">Customer notes</h3>
        </div>
        <div className="bg-zinc-50 rounded-lg border border-zinc-100 p-4 mb-5">
          <p className="text-slate-700 text-sm leading-relaxed">{notes || 'No notes available'}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2.5 border border-rose-200 bg-rose-50 text-rose-900 text-sm font-semibold rounded-md hover:bg-rose-100 transition-colors"
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-md bg-zinc-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Update status</h3>
            <p className="text-xs text-slate-500 mt-0.5">Applies to this appointment only</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSaving}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 border border-rose-200 bg-rose-50 text-rose-900 text-sm font-semibold rounded-md hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-300 to-pink-300 text-rose-900 text-sm font-semibold rounded-md hover:from-rose-400 hover:to-pink-400 shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

  const getPaymentMeta = (appointment) => {
    const status = (appointment?.paymentStatus || 'unpaid').toLowerCase();
    const method = (appointment?.paymentMethod || 'N/A').toString();
    return {
      status,
      method: method === 'khalti' ? 'Khalti' : method === 'cash' ? 'Cash' : method,
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Grooming appointments</h1>
        <p className="text-sm text-slate-600 mt-1">Review and update your schedule</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Today', value: totalToday },
          { label: 'Confirmed', value: totalConfirmed },
          { label: 'Pending', value: totalPending },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-white to-rose-50/40 rounded-lg border border-rose-100 px-4 py-4 flex flex-col gap-0.5 shadow-sm shadow-rose-100/30"
          >
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</span>
            <span className="text-2xl font-semibold tabular-nums text-slate-900">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white/90 rounded-lg border border-rose-100 p-4 mb-6 shadow-sm shadow-rose-50">
        <div className="max-w-md">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Customer, pet, or service…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2.5 pl-9 text-sm border border-rose-100 rounded-md bg-rose-50/40 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200/80 focus:bg-white focus:border-rose-200"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-zinc-200 p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-slate-700" />
          <p className="mt-4 text-sm text-slate-600">Loading appointments…</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-lg border border-rose-100 overflow-hidden shadow-sm shadow-rose-100/40">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Pet</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-rose-900/70 uppercase tracking-wide">Payment</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-rose-900/70 uppercase tracking-wide">Notes</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-rose-900/70 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/70">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-slate-500">
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
                    const payment = getPaymentMeta(apt);
                    
                    return (
                      <tr
                        key={apt.id}
                        className={`transition-colors hover:bg-rose-50/60 ${index % 2 === 1 ? 'bg-pink-50/35' : 'bg-white'}`}
                      >
                        <td className="px-4 py-3 text-slate-500 tabular-nums">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-zinc-200 flex items-center justify-center text-zinc-700 font-medium text-xs shrink-0">
                              {customerName !== 'N/A' ? customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                            </div>
                            <span className="font-medium text-slate-900">{customerName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={customerEmail}>
                          {customerEmail}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">{petName}</td>
                        <td className="px-4 py-3 text-slate-600 tabular-nums">
                          {petAge !== 'N/A' ? `${petAge} yr${petAge !== 1 ? 's' : ''}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-700 capitalize">{serviceType}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(apt.appointmentDate)}</td>
                        <td className="px-4 py-3 text-slate-900 font-medium tabular-nums whitespace-nowrap">{formatTime(apt.time)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium capitalize ${statusColors[apt.status] || 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200'}`}
                          >
                            {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex w-fit px-2 py-0.5 rounded-md text-xs font-medium capitalize ${paymentStatusColors[payment.status] || 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200'}`}
                            >
                              {payment.status}
                            </span>
                            <span className="text-xs text-slate-500">{payment.method}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {description ? (
                            <button
                              type="button"
                              onClick={() => setNotesModal(description)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => setEditModal(apt)}
                            disabled={apt.status === 'completed' || apt.status === 'cancelled' || !groomerProfile?.id}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                              apt.status === 'completed' || apt.status === 'cancelled' || !groomerProfile?.id
                                ? 'text-slate-400 cursor-not-allowed bg-zinc-50 border border-zinc-100'
                                : 'text-slate-800 border border-zinc-300 bg-white hover:bg-zinc-50'
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