import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList, ChevronRight } from 'lucide-react';

export default function Appointments() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Appointments
        </h1>
        <p className="text-gray-600">Manage your appointments and schedule new ones</p>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Create Appointment Card */}
        <div 
          onClick={() => navigate('/dashboard/appointment')}
          className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-indigo-500"
        >
          <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Plus className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Create Appointment</h3>
          <p className="text-gray-600 text-center mb-6">Schedule a new appointment with a professional veterinarian or groomer</p>
          <div className="flex justify-center">
            <span className="inline-flex items-center text-indigo-600 font-semibold text-lg">
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </span>
          </div>
        </div>

        {/* View History Card */}
        <div 
          onClick={() => navigate('/dashboard/my-appointments')}
          className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-purple-500"
        >
          <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <ClipboardList className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Appointment History</h3>
          <p className="text-gray-600 text-center mb-6">View and manage all your past and upcoming appointments in one place</p>
          <div className="flex justify-center">
            <span className="inline-flex items-center text-purple-600 font-semibold text-lg">
              View History
              <ChevronRight className="w-5 h-5 ml-2" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}