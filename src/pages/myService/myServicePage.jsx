import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import AppSiteNavbar from '../../components/AppSiteNavbar';

export default function MyServicePage() {
  const navigate = useNavigate();

  const services = [
    { title: 'Veterinary Consultation', text: 'Book experienced vets for health checks and treatment.', type: 'vet' },
    { title: 'Grooming Service', text: 'Professional grooming for hygiene and comfort.', type: 'groomer' },
    { title: 'Vaccination', text: 'Schedule vaccinations to keep your pet protected.', type: 'vet' },
    { title: 'General Check-up', text: 'Routine check-ups to monitor overall pet wellness.', type: 'vet' },
  ];

  const btnPrimary =
    'px-5 py-2.5 rounded-lg bg-[#5E7A64] text-white text-sm font-medium hover:bg-[#465D4C] shadow-sm transition-all';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F2EA] via-[#EFE8DC] to-[#FFFDF9] text-[#2F3A34]">
      <AppSiteNavbar />

      <section className="py-16 md:py-20 border-b border-rose-100 bg-white/60">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">My Service</h2>
            <p className="text-slate-600">Services currently available in the system.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <button
                key={service.title}
                type="button"
                onClick={() => navigate(`/professionals?type=${service.type}`)}
                className="text-left rounded-lg border border-[#DED7CB] bg-[#FFFDF9] p-6 shadow-sm hover:shadow-md hover:border-[#cfc4b5] transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-[#EFE8DC] border border-[#DED7CB] flex items-center justify-center mb-4 shadow-sm">
                  <Calendar className="w-5 h-5 text-[#2F3A34]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.text}</p>
                <span className="inline-block mt-4 px-4 py-2 rounded-lg bg-[#5E7A64] text-white text-sm font-medium">
                  View Professionals
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
