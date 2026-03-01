import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editProfessional } from '../../thunks/editProfessionalDetailsThunk';
import { resetEditProfessionalState } from '../../feature/editProfessionalDetailsSlice';
import { deleteProfessional } from '../../thunks/deleteProfessionalThunk';
import { resetDeleteProfessionalState } from '../../feature/deleteProfessionalSlice';
import { listProfessionals } from '../../thunks/listProfessionalsThunk';
import { assignUserProfession } from '../../thunks/assignUserProfessionThunk';
import api from '../../utils/api';
import { Pencil, Trash2, Search, Users, Loader2, AlertTriangle, UserPlus } from 'lucide-react';

const roleColors = {
  Vet: 'bg-blue-100 text-blue-700',
  Groomer: 'bg-purple-100 text-purple-700',
};

const statusColors = {
  Available: 'bg-green-100 text-green-700',
  available: 'bg-green-100 text-green-700',
  Busy: 'bg-red-100 text-red-700',
  busy: 'bg-red-100 text-red-700',
};

const roleOptions = [
  { label: 'Veterinarian', roleId: 3 },
  { label: 'Groomer', roleId: 4 },
];

function normalizeProfessional(p) {
  const isVet = p.roleId === 3;
  const profile = isVet
    ? (Array.isArray(p.vets) ? p.vets[0] : null)
    : (Array.isArray(p.groomers) ? p.groomers[0] : null);
  const roleName = p.roles?.name || (isVet ? 'Vet' : 'Groomer');
  return {
    id: p.id,
    name: p.name || '—',
    email: p.email || '—',
    phone: p.phone || '—',
    role: roleName,
    roleId: p.roleId,
    speciality: profile?.specialization || '—',
    expertise: profile?.experienceYears ?? '—',
    status: profile?.status || '—',
  };
}

function ProfessionalModal({ professional, onClose, onSave, loading, error }) {
  const [form, setForm] = useState({
    name: professional.name !== '—' ? professional.name : '',
    email: professional.email !== '—' ? professional.email : '',
    phone: professional.phone !== '—' ? professional.phone : '',
    password: '',
    roleId: professional.roleId,
    speciality: professional.speciality !== '—' ? professional.speciality : '',
    expertise: professional.expertise !== '—' ? professional.expertise : '',
    status: professional.status !== '—' ? professional.status : 'available',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-zinc-200 max-w-md w-full shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Edit Professional</h3>
              <p className="text-sm text-gray-500">{professional.name}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" placeholder="Email address" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" placeholder="Phone number" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
              <select value={form.roleId} onChange={e => setForm({ ...form, roleId: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm">
                {roleOptions.map(opt => (
                  <option key={opt.roleId} value={opt.roleId}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
              <input type="text" value={form.speciality} onChange={e => setForm({ ...form, speciality: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" placeholder="e.g. Small Animal Surgery..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
              <input type="number" min="0" max="50" value={form.expertise} onChange={e => setForm({ ...form, expertise: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" placeholder="e.g. 5" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm">
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-6 pt-0">
          <button onClick={onClose} disabled={loading} className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm disabled:opacity-50">
            Cancel
          </button>
          <button onClick={() => onSave(form)} disabled={loading} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <><Loader2 className="animate-spin w-4 h-4" />Saving...</>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ professional, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Delete Professional</h3>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <p className="text-sm font-semibold text-gray-800">{professional.name}</p>
          <p className="text-sm text-gray-500">{professional.role} — {professional.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AssignRoleModal({ onClose, onAssigned }) {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    roleId: 4,
    speciality: '',
    expertise: '',
    status: 'available',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setError('');
      try {
        const response = await api.get('/Admin/manage/users');
        const data = response?.data?.data || [];
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load users list');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAssign = async () => {
    if (!form.userId || !form.speciality.trim() || form.expertise === '') {
      setError('Please fill all required fields');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await dispatch(assignUserProfession({
        userId: Number(form.userId),
        professionData: {
          roleId: Number(form.roleId),
          speciality: form.speciality.trim(),
          expertise: Number(form.expertise),
          status: form.status,
        },
      })).unwrap();
      onAssigned();
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Failed to assign role');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-zinc-200 max-w-md w-full shadow-lg p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Add Professional</h3>
            <p className="text-sm text-gray-500">Select a user and add as Vet or Groomer</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">User</label>
            <select
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              disabled={loadingUsers || submitting}
            >
              <option value="">{loadingUsers ? 'Loading users...' : 'Select user'}</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <select
              value={form.roleId}
              onChange={(e) => setForm({ ...form, roleId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              disabled={submitting}
            >
              <option value={3}>Veterinarian</option>
              <option value={4}>Groomer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
            <input
              type="text"
              value={form.speciality}
              onChange={(e) => setForm({ ...form, speciality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              placeholder={form.roleId === 3 ? 'e.g. Small Animal Practice' : 'e.g. Dog Grooming & Styling'}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={form.expertise}
              onChange={(e) => setForm({ ...form, expertise: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              disabled={submitting}
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={submitting}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Assigning...
              </>
            ) : (
              'Add Professional'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ManageProfessionalsPage() {
  const dispatch = useDispatch();

  const { loading: editLoading, error: editError, success: editSuccess } = useSelector((state) => state.editProfessional);
  const { loading: deleteLoading, success: deleteSuccess } = useSelector((state) => state.deleteProfessional);
  const { professionals: apiProfessionals, loading: listLoading, error: listError } = useSelector((state) => state.listProfessionals);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [assignRoleModal, setAssignRoleModal] = useState(false);

  const fetchProfessionals = useCallback(() => {
    const params = {};
    if (roleFilter !== 'all') params.roleId = Number(roleFilter);
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    dispatch(listProfessionals(params));
  }, [dispatch, roleFilter, debouncedSearch]);

  useEffect(() => { 
    fetchProfessionals(); 
  }, [fetchProfessionals]);

  useEffect(() => {
    if (editSuccess) {
      setEditModal(null);
      dispatch(resetEditProfessionalState());
      fetchProfessionals();
    }
  }, [editSuccess, dispatch, fetchProfessionals]);

  useEffect(() => {
    if (deleteSuccess) {
      setDeleteModal(null);
      dispatch(resetDeleteProfessionalState());
      fetchProfessionals();
    }
  }, [deleteSuccess, dispatch, fetchProfessionals]);

  const handleCloseEditModal = () => {
    setEditModal(null);
    dispatch(resetEditProfessionalState());
  };

  const professionals = Array.isArray(apiProfessionals) ? apiProfessionals.map(normalizeProfessional) : [];
  const filtered = professionals.filter(p => statusFilter === 'all' || p.status?.toLowerCase() === statusFilter);

  const handleSaveEdit = (id, form) => {
    dispatch(editProfessional({
      professionalId: id,
      professionalData: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        roleId: form.roleId,
        speciality: form.speciality,
        expertise: form.expertise,
        status: form.status,
        ...(form.password ? { password: form.password } : {}),
      },
    }));
  };

  const handleDelete = (professionalId) => {
    dispatch(deleteProfessional({ professionalId }));
  };

  const getInitials = (name) => {
    if (!name || name === '—') return '?';
    const parts = name.replace('Dr. ', '').split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Professionals</h1>
          <p className="text-gray-600">View and manage veterinarians and groomers on the platform</p>
        </div>
        <button
          onClick={() => setAssignRoleModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Professional
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Professionals', value: professionals.length, color: 'bg-indigo-100 text-indigo-700' },
          { label: 'Veterinarians', value: professionals.filter(p => p.roleId === 3).length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Groomers', value: professionals.filter(p => p.roleId === 4).length, color: 'bg-purple-100 text-purple-700' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`px-3 py-2 rounded-xl text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Name</label>
            <div className="relative">
              <input type="text" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Role</label>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800">
              <option value="all">All Roles</option>
              <option value="3">Veterinarian</option>
              <option value="4">Groomer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800">
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
          </div>
        </div>
      </div>

      {listError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-medium">{listError}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border-2 border-[#cfc4b5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#e5ddcf] text-[#2F3A34] border-b-2 border-[#cfc4b5]">
                <th className="px-6 py-4 text-left text-sm font-semibold border-r border-[#cfc4b5]">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold border-r border-[#cfc4b5]">Professional</th>
                <th className="px-6 py-4 text-left text-sm font-semibold border-r border-[#cfc4b5]">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold border-r border-[#cfc4b5]">Specialization</th>
                <th className="px-6 py-4 text-left text-sm font-semibold border-r border-[#cfc4b5]">Experience</th>
                <th className="px-6 py-4 text-left text-sm font-semibold border-r border-[#cfc4b5]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold border-r border-[#cfc4b5]">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold border-r border-[#cfc4b5]">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8d0c3]">
              {listLoading ? (
                <tr><td colSpan={9} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin w-10 h-10 text-indigo-400" />
                    <p className="text-gray-500 font-medium">Loading professionals...</p>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users className="w-14 h-14 text-gray-300" />
                    <p className="text-gray-500 font-medium">No professionals found</p>
                  </div>
                </td></tr>
              ) : (
                filtered.map((pro, index) => (
                  <tr key={pro.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {getInitials(pro.name)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{pro.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[pro.role] || 'bg-gray-100 text-gray-700'}`}>{pro.role}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pro.speciality}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {pro.expertise !== '—' ? <><span className="font-semibold text-gray-800">{pro.expertise}</span><span className="text-gray-500 ml-1">yrs</span></> : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pro.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pro.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[pro.status] || 'bg-gray-100 text-gray-700'}`}>{pro.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditModal(pro)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-xs font-semibold">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => setDeleteModal(pro)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-xs font-semibold">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editModal && (
        <ProfessionalModal
          professional={editModal}
          onClose={handleCloseEditModal}
          onSave={(fields) => handleSaveEdit(editModal.id, fields)}
          loading={editLoading}
          error={editError}
        />
      )}
      {deleteModal && (
        <DeleteModal 
          professional={deleteModal} 
          onClose={() => setDeleteModal(null)} 
          onConfirm={() => handleDelete(deleteModal.id)} 
          loading={deleteLoading}
        />
      )}
      {assignRoleModal && (
        <AssignRoleModal
          onClose={() => setAssignRoleModal(false)}
          onAssigned={() => {
            setAssignRoleModal(false);
            fetchProfessionals();
          }}
        />
      )}
    </div>
  );
}