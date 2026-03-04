import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList, ChevronRight } from 'lucide-react';

export default function Appointments() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Appointments</h1>
        <p className="text-sm text-slate-600">Schedule and review visits</p>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        {/* Create Appointment Card */}
        <div
          onClick={() => navigate('/dashboard/appointment')}
          className="bg-white rounded-2xl border border-rose-200 shadow-sm p-8 md:p-10 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Create appointment</h3>
          <p className="text-slate-600 text-sm text-center mb-6">Schedule with a vet or groomer</p>
          <div className="flex justify-center">
            <span className="inline-flex items-center text-rose-600 font-medium text-sm">
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </span>
          </div>
        </div>

        {/* View History Card */}
        <div
          onClick={() => navigate('/dashboard/my-appointments')}
          className="bg-white rounded-2xl border border-rose-200 shadow-sm p-8 md:p-10 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Appointment history</h3>
          <p className="text-slate-600 text-sm text-center mb-6">View past and upcoming visits</p>
          <div className="flex justify-center">
            <span className="inline-flex items-center text-rose-600 font-medium text-sm">
              View History
              <ChevronRight className="w-5 h-5 ml-2" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}