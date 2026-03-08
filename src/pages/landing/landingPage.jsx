import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import dashboardHero from '../../assets/Dashboard.png';
import BrandLogo from '../../components/BrandLogo';

export default function LandingPage() {
  const navigate = useNavigate();
  const serviceItems = [
    { title: 'Veterinary Consultation', text: 'Book experienced vets for health checks and treatment.' },
    { title: 'Grooming Service', text: 'Professional grooming for hygiene and comfort.' },
    { title: 'Vaccination', text: 'Schedule vaccinations to keep your pet protected.' },
    { title: 'General Check-up', text: 'Routine check-ups to monitor overall pet wellness.' },
  ];

  const btnPrimary =
    'px-5 py-2.5 rounded-lg bg-[#5E7A64] text-white text-sm font-medium hover:bg-[#465D4C] shadow-sm transition-all';
  const btnNav =
    'px-5 py-2.5 rounded-lg border border-[#DED7CB] bg-[#FFFDF9] text-sm font-medium text-[#2F3A34] hover:bg-[#F6F2EA] transition-colors';
  const navLinkClass =
    'text-sm font-medium text-[#2F3A34] hover:text-[#465D4C] transition-colors';
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F2EA] via-[#EFE8DC] to-[#FFFDF9] text-[#2F3A34]">
      <nav className="border-b border-[#DED7CB] bg-[#FFFDF9]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 py-4 grid grid-cols-3 items-center">
          <div className="justify-self-start min-w-0">
            <BrandLogo
              onClick={() => navigate('/')}
              ariaLabel="Pet Perfect — go to home"
              imgClassName="h-11 sm:h-14 w-auto max-w-[240px] sm:max-w-[320px] object-contain object-left cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-center gap-6">
            <button type="button" onClick={() => navigate('/')} className={navLinkClass}>
              Home
            </button>
            <button type="button" onClick={() => navigate('/my-service')} className={navLinkClass}>
              My Service
            </button>
            <button type="button" onClick={() => navigate('/about-us')} className={navLinkClass}>
              About Us
            </button>
          </div>
          <div className="flex items-center gap-3 justify-self-end">
            <button type="button" onClick={() => navigate('/login')} className={btnNav}>
              Sign In
            </button>
            <button type="button" onClick={() => navigate('/register')} className={btnPrimary}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="border-b border-[#DED7CB] bg-gradient-to-br from-[#F6F2EA] via-[#EFE8DC] to-[#F6F2EA]">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-5">
                Pet care, without the hassle
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Book appointments with veterinarians and groomers in one place.
              </p>
              <button type="button" onClick={() => navigate('/register')} className={btnPrimary + ' px-8 py-3 text-base'}>
                Start free
              </button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-xl rounded-xl border border-rose-200/60 bg-white p-2 shadow-md shadow-rose-100/80">
                <img
                  src={dashboardHero}
                  alt="PetPerfect dashboard"
                  className="w-full h-auto rounded-lg object-contain"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="my-service" className="py-16 md:py-20 border-b border-rose-100 bg-white/60">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">My Service</h2>
            <p className="text-slate-600">Services currently available in the system.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {serviceItems.map((service) => (
              <button
                key={service.title}
                type="button"
                onClick={() =>
                  navigate(
                    `/professionals?type=${service.title === 'Grooming Service' ? 'groomer' : 'vet'}`
                  )
                }
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

      <section id="about-us" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">How it works</h2>
            <p className="text-slate-600">Three steps to get started</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { n: '1', title: 'Create an account', text: 'Sign up and add your pet.' },
              { n: '2', title: 'Find a professional', text: 'Browse vets and groomers.' },
              { n: '3', title: 'Book a visit', text: 'Pick a time and confirm.' },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EFE8DC] border border-[#DED7CB] text-[#2F3A34] text-sm font-semibold mb-4">
                  {step.n}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-r from-[#5E7A64] via-[#526C58] to-[#465D4C] text-white">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">Ready to start?</h2>
          <p className="text-[#EAF4EC] mb-8 text-sm md:text-base">Create a free account and book your first appointment.</p>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="px-8 py-3 rounded-lg bg-[#FFFDF9] text-[#2F3A34] text-sm font-medium hover:bg-[#F6F2EA] shadow-lg shadow-black/10 transition-colors"
          >
            Create account
          </button>
        </div>
      </section>
    </div>
  );
}
