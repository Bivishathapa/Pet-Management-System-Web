import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../feature/loginSlice';
import { Home, Calendar, PlusCircle, Scissors, FileText, Users, Briefcase, LogOut, X } from 'lucide-react';

const allMenuItems = [
  {
    name: 'Home',
    path: '/dashboard/home',
    roles: [2],
    icon: <Home className="w-6 h-6" />,
  },
  {
    name: 'Appointments',
    path: '/dashboard/appointments',
    roles: [2],
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    name: 'Add Pets',
    path: '/dashboard/add-pets',
    roles: [2],
    icon: <PlusCircle className="w-6 h-6" />,
  },
  {
    name: 'My Appointments',
    path: '/dashboard/groomer-appointments',
    roles: [4],
    icon: <Scissors className="w-6 h-6" />,
  },
  {
    name: 'My Appointments',
    path: '/dashboard/vet-appointments',
    roles: [3],
    icon: <FileText className="w-6 h-6" />,
  },
  {
    name: 'Manage Users',
    path: '/dashboard/manage-users',
    roles: [1],
    icon: <Users className="w-6 h-6" />,
  },
  {
    name: 'Manage Professionals',
    path: '/dashboard/manage-professionals',
    roles: [1],
    icon: <Briefcase className="w-6 h-6" />,
  },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authState = useSelector((state) => state.auth);
  const userData = authState?.user?.data || authState?.user;
  const roleId = userData?.user?.roleId;

  const menuItems = allMenuItems.filter((item) => item.roles.includes(roleId));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] bg-linear-to-b from-indigo-900 via-indigo-800 to-purple-900 transition-transform duration-300 ease-in-out w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex lg:hidden items-center justify-end p-4 shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 mt-8 lg:mt-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-white text-indigo-900 shadow-lg'
                          : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="font-medium whitespace-nowrap ml-3">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 bg-linear-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
            >
              <LogOut className="w-6 h-6 shrink-0" />
              <span className="whitespace-nowrap ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}