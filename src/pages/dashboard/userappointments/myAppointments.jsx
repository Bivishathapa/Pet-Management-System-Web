import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../utils/api';
import { fetchUpcomingAppointments } from '../../../thunks/getUpcomingAppointmentThunk';
import { fetchCompletedAppointments } from '../../../thunks/getCompletedAppointmentThunk';
import { fetchCancelledAppointments } from '../../../thunks/getCancelledAppointmentThunk';
import { rescheduleAppointment, cancelAppointment } from '../../../thunks/rescheduleAppointmentThunk';
import { clearRescheduleState } from '../../../feature/rescheduleAppointmentSlice';
import { initiatePayment } from '../../../thunks/makePaymentThunk';
import { clearPaymentState } from '../../../feature/makePaymentSlice';
import { verifyKhaltiPayment } from '../../../thunks/verifyPaymentThunk';
import { clearVerifyState } from '../../../feature/verifyPaymentSlice';
import {
  Search, AlertTriangle, Star, CalendarDays, Clock,
  User, FileText, CalendarX, CreditCard, Wallet,
  Banknote, CheckCircle, XCircle, Loader,
} from 'lucide-react';

function resolveUserId(user) {
  if (!user) return null;
  return (
    user?.data?.user?.id ||
    user?.data?.id ||
    user?.user?.id ||
    user?.id ||
    null
  );
}

function getProfessionalName(professional) {
  if (!professional) return 'N/A';
  if (professional.name) return professional.name;
  const first = professional.firstName || '';
  const last = professional.lastName || '';
  return `${first} ${last}`.trim() || 'N/A';
}

function getInitialsFromName(fullName) {
  if (!fullName || fullName === 'N/A') return 'NA';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'NA';
  const first = parts[0];
  const last = parts[parts.length - 1];
  const honorifics = ['dr.', 'mr.', 'ms.', 'mrs.', 'prof.'];
  const firstInitial = honorifics.includes(first.toLowerCase())
    ? parts[1]?.[0] || first[0]
    : first[0];
  return `${firstInitial}${last[0]}`.toUpperCase();
}

function normalizeTimeForInput(timeValue) {
  if (!timeValue) return '';
  const raw = String(timeValue).trim();

  // 09:30:00 -> 09:30
  const hhmmss = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (hhmmss) {
    const h = String(parseInt(hhmmss[1], 10)).padStart(2, '0');
    const m = hhmmss[2];
    return `${h}:${m}`;
  }

  // 9:30 AM / 9:30 PM -> 24h HH:MM
  const ampm = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hour = parseInt(ampm[1], 10);
    const minute = ampm[2];
    const meridiem = ampm[3].toUpperCase();
    if (meridiem === 'AM' && hour === 12) hour = 0;
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    return `${String(hour).padStart(2, '0')}:${minute}`;
  }

  return '';
}

function VerificationBanner({ status, message, onDismiss }) {
  if (status === 'verifying') {
    return (
      <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center gap-3">
        <Loader className="w-5 h-5 animate-spin shrink-0" />
        <span className="font-medium">Verifying your Khalti payment, please wait...</span>
      </div>
    );
  }
  if (status === 'success') {
    return (
      <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
        <CheckCircle className="w-5 h-5 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Payment Verified Successfully!</p>
          {message && <p className="text-sm mt-0.5">{message}</p>}
        </div>
        <button onClick={onDismiss} className="ml-auto text-green-500 hover:text-green-700">
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
        <XCircle className="w-5 h-5 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Payment Verification Failed</p>
          {message && <p className="text-sm mt-0.5">{message}</p>}
        </div>
        <button onClick={onDismiss} className="ml-auto text-red-500 hover:text-red-700">
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    );
  }
  return null;
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ appointment, onClose, onPaymentInitiated, loading, error }) {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePayment = () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }
    onPaymentInitiated(selectedPayment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-zinc-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Make Payment</h3>
            <p className="text-sm text-gray-500">Complete your appointment payment</p>
          </div>
        </div>

        {/* Appointment Summary */}
        <div className="bg-zinc-50 rounded-xl p-4 mb-5 border border-rose-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-800">{appointment.type}</p>
              <p className="text-xs text-gray-600 mt-0.5">{appointment.professional.name}</p>
              <p className="text-xs text-gray-500">Pet: {appointment.petName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-2xl font-bold text-rose-600">Rs. {appointment.amount || 1500}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Method</label>
          <div className="space-y-3">
            {/* Khalti */}
            <button
              onClick={() => setSelectedPayment('khalti')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedPayment === 'khalti'
                  ? 'border-pink-500 bg-pink-50 shadow-md'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedPayment === 'khalti' ? 'bg-pink-600' : 'bg-pink-100'
                }`}>
                  <Wallet className={`w-6 h-6 ${selectedPayment === 'khalti' ? 'text-white' : 'text-pink-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    Khalti
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Digital</span>
                  </p>
                  <p className="text-xs text-gray-600">Pay with Khalti wallet</p>
                </div>
                {selectedPayment === 'khalti' && (
                  <div className="w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Cash */}
            <button
              onClick={() => setSelectedPayment('cash')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedPayment === 'cash'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedPayment === 'cash' ? 'bg-green-600' : 'bg-green-100'
                }`}>
                  <Banknote className={`w-6 h-6 ${selectedPayment === 'cash' ? 'text-white' : 'text-green-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    Cash Payment
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">On Visit</span>
                  </p>
                  <p className="text-xs text-gray-600">Pay cash during appointment</p>
                </div>
                {selectedPayment === 'cash' && (
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={!!loading}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedPayment || !!loading}
            className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Proceed to Pay
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Secure payment gateway
        </div>
      </div>
    </div>
  );
}

function RescheduleModal({ appointment, onClose, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    appointmentDate: appointment.date || '',
    time: normalizeTimeForInput(appointment.time),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-zinc-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Reschedule Appointment</h3>
            <p className="text-sm text-gray-500">{appointment.type}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <p className="text-sm text-gray-800 font-semibold mb-1">{appointment.professional.name}</p>
          <p className="text-sm text-gray-600">Pet: {appointment.petName}</p>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Date</label>
            <input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
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
            onClick={() => onSave(formData)}
            disabled={isSaving || !formData.appointmentDate || !formData.time}
            className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Reschedule'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ appointment, onClose, onSubmit, isSubmitting }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-zinc-200">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Rate this appointment</h3>
        <p className="text-sm text-gray-600 mb-4">
          {appointment.type} with {appointment.professional.name}
        </p>

        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-1"
            >
              <Star
                className={`w-7 h-7 ${
                  value <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review (optional)"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 mb-4"
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ rating, comment })}
            disabled={isSubmitting || rating === 0}
            className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyAppointmentsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const upcomingState = useSelector((state) => state.upcomingAppointments) || {};
  const completedState = useSelector((state) => state.completedAppointments) || {};
  const cancelledState = useSelector((state) => state.cancelledAppointments) || {};
  const {
    loading: rescheduleLoading,
    error: rescheduleError,
    success: rescheduleSuccess,
  } = useSelector((state) => state.rescheduleAppointment);
  const {
    loading: paymentLoading,
    error: paymentError,
    success: paymentSuccess,
    paymentData,
  } = useSelector((state) => state.makePayment);
  const {
    loading: verifyLoading,
    error: verifyError,
  } = useSelector((state) => state.verifyPayment);

  const upcomingAppointments = upcomingState.appointments || [];
  const upcomingLoading = upcomingState.loading || false;
  const upcomingError = upcomingState.error || null;

  const completedAppointments = completedState.appointments || [];
  const completedLoading = completedState.loading || false;
  const completedError = completedState.error || null;

  const cancelledAppointments = cancelledState.appointments || [];
  const cancelledLoading = cancelledState.loading || false;
  const cancelledError = cancelledState.error || null;

  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const [verificationStatus, setVerificationStatus] = useState(null); // null | 'verifying' | 'success' | 'failed'
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pidxFromUrl = urlParams.get('pidx');
    const pidxFromStorage = sessionStorage.getItem('khalti_pidx');
    const pidx = pidxFromUrl || pidxFromStorage;

    if (!pidx) return;

    sessionStorage.removeItem('khalti_pidx');

    if (pidxFromUrl) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    setVerificationStatus('verifying');

    dispatch(verifyKhaltiPayment({ pidx }))
      .unwrap()
      .then((data) => {
        setVerificationStatus('success');

        const userId = resolveUserId(user);
        if (userId) {
          dispatch(fetchUpcomingAppointments(userId));
          dispatch(fetchCompletedAppointments(userId));
          dispatch(fetchCancelledAppointments(userId));
        }

        setTimeout(() => {
          setVerificationStatus(null);
          setVerificationMessage('');
          dispatch(clearVerifyState());
        }, 8000);
      })
      .catch((err) => {
        setVerificationStatus('failed');
        setVerificationMessage(
          typeof err === 'string'
            ? err
            : err?.message || 'Verification failed. Please contact support.'
        );
      });
  }, [dispatch]);

  useEffect(() => {
    const userId = resolveUserId(user);
    if (!userId) {
      console.warn('[MyAppointmentsPage] userId is null — appointments will NOT be fetched.');
      return;
    }
    dispatch(fetchUpcomingAppointments(userId));
    dispatch(fetchCompletedAppointments(userId));
    dispatch(fetchCancelledAppointments(userId));
  }, [dispatch, user]);

  // Handle success message
  useEffect(() => {
    if (rescheduleSuccess) {
      const userId = resolveUserId(user);
      if (userId) {
        // Refresh appointments after successful reschedule/cancel
        dispatch(fetchUpcomingAppointments(userId));
        dispatch(fetchCompletedAppointments(userId));
        dispatch(fetchCancelledAppointments(userId));
      }

      setSuccessMessage('Appointment updated successfully!');
      setShowRescheduleModal(false);
      setShowCancelModal(false);
      setSelectedAppointment(null);

      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
        dispatch(clearRescheduleState());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [rescheduleSuccess, dispatch, user]);

  useEffect(() => {
    if (paymentSuccess && paymentData) {
      const method = paymentData.method;

      if (method === 'khalti' && paymentData.paymentData?.payment_url) {
        window.location.href = paymentData.paymentData.payment_url;
        return; 
      }

      if (method === 'cash') {
        setSuccessMessage('Cash payment selected. Please pay during your appointment.');
      }

      setShowPaymentModal(false);
      setSelectedAppointment(null);

      const userId = resolveUserId(user);
      if (userId) {
        dispatch(fetchUpcomingAppointments(userId));
        dispatch(fetchCompletedAppointments(userId));
        dispatch(fetchCancelledAppointments(userId));
      }

      const timer = setTimeout(() => {
        setSuccessMessage('');
        dispatch(clearPaymentState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, paymentData, dispatch, user]);

  const appointmentsByTab = {
    upcoming: Array.isArray(upcomingAppointments) ? upcomingAppointments : [],
    past: Array.isArray(completedAppointments) ? completedAppointments : [],
    cancelled: Array.isArray(cancelledAppointments) ? cancelledAppointments : [],
  };

  const errorByTab = {
    upcoming: upcomingError,
    past: completedError,
    cancelled: cancelledError,
  };

  const currentAppointments = appointmentsByTab[selectedTab];
  const currentError = errorByTab[selectedTab];

  const formatAppointment = (apt) => {
    const professional = apt.vet || apt.groomer;
    const serviceType = apt.serviceType === 'vet' ? 'Veterinary Consultation' : 'Grooming Service';
    const professionalName = getProfessionalName(professional);
    const avatar = getInitialsFromName(professionalName);

    return {
      id: apt.id,
      type: apt.appointmentType || serviceType,
      professional: {
        name: professionalName,
        specialty: professional?.specialization || professional?.expertise || 'General Service',
        avatar,
        rating: typeof professional?.rating === 'number' ? professional.rating : null,
      },
      date: apt.appointmentDate,
      time: apt.time,
      status: apt.status,
      petName: apt.pet?.name || 'Unknown Pet',
      notes: apt.description || '',
      serviceType: apt.serviceType,
      amount: apt.amount || 1500,
    };
  };

  const filteredAppointments = currentAppointments
    .map(formatAppointment)
    .filter((apt) => {
      const q = searchTerm.toLowerCase();
      return (
        apt.professional.name.toLowerCase().includes(q) ||
        apt.type.toLowerCase().includes(q) ||
        apt.petName.toLowerCase().includes(q)
      );
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending':   return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-rose-100 text-rose-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default:          return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes('veterinary') || t.includes('consultation')) return '🏥';
    if (t.includes('grooming'))    return '✂️';
    if (t.includes('vaccination')) return '💉';
    if (t.includes('checkup') || t.includes('check-up')) return '🩺';
    return '📋';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancelAppointment = (appointment) => {
    dispatch(clearRescheduleState());
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment?.id) return;
    try {
      await dispatch(cancelAppointment({ appointmentId: selectedAppointment.id })).unwrap();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const confirmReschedule = async (formData) => {
    if (!selectedAppointment?.id) return;
    if (!formData.appointmentDate || !formData.time) {
      alert('Please select both date and time');
      return;
    }
    try {
      await dispatch(rescheduleAppointment({
        appointmentId: selectedAppointment.id,
        appointmentDate: formData.appointmentDate,
        time: formData.time,
      })).unwrap();
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
    }
  };

  const handleMakePayment = (appointment) => {
    dispatch(clearPaymentState());
    setSelectedAppointment(appointment);
    setShowPaymentModal(true);
  };

  const handleOpenReview = (appointment) => {
    setReviewError('');
    setSelectedAppointment(appointment);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async ({ rating, comment }) => {
    if (!selectedAppointment?.id) return;
    if (!rating) {
      setReviewError('Please select a star rating.');
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError('');
      await api.post(`/user/appointment/${selectedAppointment.id}/review`, {
        rating,
        comment: comment?.trim() || null,
      });

      setShowReviewModal(false);
      setSelectedAppointment(null);
      setSuccessMessage('Thank you! Your review was submitted successfully.');
      const userId = resolveUserId(user);
      if (userId) {
        dispatch(fetchCompletedAppointments(userId));
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setReviewError(error?.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const confirmPayment = async (method) => {
    if (!selectedAppointment?.id) return;
    try {
      await dispatch(initiatePayment({
        appointmentId: selectedAppointment.id,
        amount: selectedAppointment.amount || 1500,
        method,
      })).unwrap();
    } catch (error) {
      console.error('Failed to initiate payment:', error);
    }
  };

  const isLoading =
    (selectedTab === 'upcoming'  && upcomingLoading)  ||
    (selectedTab === 'past'      && completedLoading) ||
    (selectedTab === 'cancelled' && cancelledLoading);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Appointments</h1>
        <p className="text-gray-600">View and manage your scheduled appointments</p>
      </div>

      {/* Khalti Verification Banner */}
      <VerificationBanner
        status={verificationStatus}
        message={verificationMessage}
        onDismiss={() => {
          setVerificationStatus(null);
          setVerificationMessage('');
          dispatch(clearVerifyState());
        }}
      />

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Reschedule Error Message */}
      {rescheduleError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{rescheduleError}</span>
          <button onClick={() => dispatch(clearRescheduleState())} className="ml-auto text-red-500 hover:text-red-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Payment Error */}
      {paymentError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{paymentError}</span>
          <button onClick={() => dispatch(clearPaymentState())} className="ml-auto text-red-500 hover:text-red-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {reviewError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{reviewError}</span>
        </div>
      )}

      {/* Verify Error */}
      {verifyError && verificationStatus !== 'failed' && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{verifyError}</span>
          <button onClick={() => dispatch(clearVerifyState())} className="ml-auto text-red-500 hover:text-red-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <div className="flex items-center gap-4 border-b border-gray-200">
          {[
            { key: 'upcoming',  label: 'Upcoming',  count: upcomingAppointments.length },
            { key: 'past',      label: 'Completed', count: completedAppointments.length },
            { key: 'cancelled', label: 'Cancelled', count: cancelledAppointments.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`pb-4 px-4 font-semibold transition-all relative ${
                selectedTab === tab.key ? 'text-rose-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                selectedTab === tab.key ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
              {selectedTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600 rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Appointments</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by professional, type, or pet name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {currentError && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{currentError}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      )}

      {/* Appointments List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 hover:border-zinc-300 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Professional Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {appointment.professional.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{getTypeIcon(appointment.type)}</span>
                      <h3 className="text-lg font-bold text-gray-800">{appointment.type}</h3>
                    </div>
                    <p className="text-gray-600 font-semibold">{appointment.professional.name}</p>
                    <p className="text-sm text-gray-500">{appointment.professional.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-800">
                        {appointment.professional.rating !== null ? appointment.professional.rating : 'Not rated yet'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-rose-500" />
                    <span className="text-sm text-gray-800 font-medium">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-rose-500" />
                    <span className="text-sm text-gray-800 font-medium">{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-rose-500" />
                    <span className="text-sm text-gray-800 font-medium">Pet: {appointment.petName}</span>
                  </div>
                  {appointment.notes && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-rose-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{appointment.notes}</span>
                    </div>
                  )}
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                    {appointment.status
                      ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
                      : 'Unknown'}
                  </span>

                  {selectedTab === 'upcoming' && (
                    <div className="flex flex-col gap-2 w-full lg:w-auto">
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleMakePayment(appointment)}
                          disabled={paymentLoading || verifyLoading}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CreditCard className="w-4 h-4" />
                          Make Payment
                        </button>
                      )}
                      <button
                        onClick={() => handleReschedule(appointment)}
                        disabled={rescheduleLoading}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appointment)}
                        disabled={rescheduleLoading}
                        className="px-4 py-2 bg-white border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {selectedTab === 'past' && (
                    <div className="flex flex-col gap-2 w-full lg:w-auto">
                      <button
                        onClick={() => handleOpenReview(appointment)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold text-sm"
                      >
                        Rate & Review
                      </button>
                      <button className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold text-sm">
                        Book Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredAppointments.length === 0 && !currentError && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-12 text-center">
          <CalendarX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : `You don't have any ${selectedTab} appointments`}
          </p>
          {selectedTab === 'upcoming' && !searchTerm && (
            <button className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold">
              Book New Appointment
            </button>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedAppointment && (
        <PaymentModal
          appointment={selectedAppointment}
          onClose={() => { setShowPaymentModal(false); setSelectedAppointment(null); }}
          onPaymentInitiated={confirmPayment}
          loading={paymentLoading || verifyLoading}
          error={paymentError}
        />
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={() => { setShowRescheduleModal(false); setSelectedAppointment(null); }}
          onSave={confirmReschedule}
          isSaving={rescheduleLoading}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Cancel Appointment</h3>
                <p className="text-sm text-gray-600">Are you sure you want to cancel?</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-800 font-semibold">{selectedAppointment.type}</p>
              <p className="text-sm text-gray-600">with {selectedAppointment.professional.name}</p>
              <p className="text-sm text-gray-600">
                {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
              </p>
            </div>

            {rescheduleError ? (
              <p className="text-sm text-red-600 mb-4" role="alert">
                {rescheduleError}
              </p>
            ) : null}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  dispatch(clearRescheduleState());
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                }}
                disabled={rescheduleLoading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                disabled={rescheduleLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {rescheduleLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && selectedAppointment && (
        <ReviewModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedAppointment(null);
            setReviewError('');
          }}
          onSubmit={handleSubmitReview}
          isSubmitting={reviewLoading}
        />
      )}
    </div>
  );
}