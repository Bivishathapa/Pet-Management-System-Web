import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Pencil, Trash2, AlertTriangle, Users, Loader2 } from 'lucide-react';
import { listUsers } from '../../thunks/listUsersThunk';
import { resetListUsersState } from '../../feature/listUsersSlice';
import { editUser } from '../../thunks/editUserDetailsThunk';
import { resetEditUserState } from '../../feature/editUserDetailsSlice';
import { deleteUser } from '../../thunks/deleteUserThunk';
import { resetDeleteUserState } from '../../feature/deleteUserSlice';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-700',
};

function EditUserModal({ user, onClose, onSave }) {
  const dispatch = useDispatch();
  const { loading: editLoading, error: editError, success } = useSelector((state) => state.editUser);
  
  const [form, setForm] = useState({
    firstName: user.firstName || user.name?.split(' ')[0] || '',
    lastName: user.lastName || user.name?.split(' ')[1] || '',
    email: user.email,
    phone: user.phone,
    status: user.status || 'active',
  });

  // Handle successful edit
  useEffect(() => {
    if (success) {
      onSave();
      dispatch(resetEditUserState());
    }
  }, [success, onSave, dispatch]);

  const handleSubmit = () => {
    const userData = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
    };

    dispatch(editUser({ userId: user.id, userData }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Pencil className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Edit User</h3>
            <p className="text-sm text-gray-500">{form.firstName} {form.lastName}</p>
          </div>
        </div>
        
        {editError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {editError}
          </div>
        )}

        <div className="space-y-4 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                value={form.firstName} 
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" 
                disabled={editLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                value={form.lastName} 
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" 
                disabled={editLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" 
              disabled={editLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
            <input 
              type="text" 
              value={form.phone} 
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" 
              disabled={editLoading}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
            disabled={editLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={editLoading}
          >
            {editLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
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

function DeleteModal({ user, onClose, onConfirm, loading }) {
  const displayName = user.name || `${user.firstName} ${user.lastName}`;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Delete User</h3>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <p className="text-sm font-semibold text-gray-800">{displayName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
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

function normalizeUser(user) {
  const nameParts = (user.name || '').split(' ');
  return {
    ...user,
    firstName: user.firstName || nameParts[0] || '',
    lastName: user.lastName || nameParts.slice(1).join(' ') || '',
    pets: user.totalPets ?? user.pets ?? 0,
    joinedDate: user.joinedDate || user.createdAt || '',
    status: user.status || 'active',
  };
}

export default function ManageUsersPage() {
  const dispatch = useDispatch();
  const { users: apiUsers, loading, error } = useSelector((state) => state.listUsers);
  const { loading: deleteLoading, success: deleteSuccess } = useSelector((state) => state.deleteUser);

  const [localUsers, setLocalUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(listUsers({}));
    return () => {
      dispatch(resetListUsersState());
      dispatch(resetEditUserState());
      dispatch(resetDeleteUserState());
    };
  }, [dispatch]);
  useEffect(() => {
    if (apiUsers?.length) {
      setLocalUsers(apiUsers.map(normalizeUser));
    }
  }, [apiUsers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(listUsers({ name: searchTerm || undefined }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setDeleteModal(null);
      dispatch(resetDeleteUserState());
      dispatch(listUsers({ name: searchTerm || undefined }));
    }
  }, [deleteSuccess, dispatch, searchTerm]);

  const filtered = localUsers.filter((u) => {
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const handleSaveEdit = () => {
    dispatch(listUsers({ name: searchTerm || undefined }));
    setEditModal(null);
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser({ userId }));
  };

  const activeCount = localUsers.filter((u) => u.status === 'active').length;
  const inactiveCount = localUsers.filter((u) => u.status === 'inactive').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Users</h1>
        <p className="text-gray-600">View and manage all registered users on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Users', value: localUsers.length, color: 'bg-indigo-100 text-indigo-700' },
          { label: 'Active', value: activeCount, color: 'bg-green-100 text-green-700' },
          { label: 'Inactive', value: inactiveCount, color: 'bg-red-100 text-red-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">
            <div className={`px-3 py-2 rounded-xl text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Users</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Joined Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Pets</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                      <p className="text-gray-500 font-medium">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-14 h-14 text-gray-300" />
                      <p className="text-gray-500 font-medium">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user, index) => {
                  const firstName = user.firstName || '';
                  const lastName = user.lastName || '';
                  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '?';
                  return (
                    <tr key={user.id} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {initials}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{firstName} {lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(user.joinedDate)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {user.pets} pet{user.pets !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.status] || 'bg-gray-100 text-gray-600'}`}>
                          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-xs font-semibold"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-xs font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editModal && (
        <EditUserModal
          user={editModal}
          onClose={() => setEditModal(null)}
          onSave={handleSaveEdit}
        />
      )}
      {deleteModal && (
        <DeleteModal
          user={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={() => handleDelete(deleteModal.id)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}