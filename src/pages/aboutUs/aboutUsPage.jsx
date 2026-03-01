import React from 'react';
import { HeartHandshake, ShieldCheck, Stethoscope, Sparkles, CalendarCheck, MessageCircle } from 'lucide-react';
import AppSiteNavbar from '../../components/AppSiteNavbar';

export default function AboutUsPage() {
  const values = [
    {
      icon: ShieldCheck,
      title: 'Trusted professionals',
      description: 'We connect pet owners with verified veterinarians and groomers for dependable care.',
    },
    {
      icon: CalendarCheck,
      title: 'Simple appointment booking',
      description: 'Book, track, and manage appointments with a clean workflow designed for everyday use.',
    },
    {
      icon: MessageCircle,
      title: 'Clear communication',
      description: 'Stay updated with timely information so you can make informed decisions for your pet.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F2EA] via-[#EFE8DC] to-[#FFFDF9] text-[#2F3A34]">
      <AppSiteNavbar />

      <section className="border-b border-[#DED7CB] bg-gradient-to-br from-[#F6F2EA] via-[#EFE8DC] to-[#F6F2EA]">
        <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DED7CB] bg-[#FFFDF9] px-3 py-1 text-xs font-semibold tracking-wide text-[#465D4C]">
              <HeartHandshake className="w-3.5 h-3.5" />
              ABOUT PETPERFECT
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
              Better care coordination for every pet, owner, and professional
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed">
              PetPerfect helps you discover trusted pet care services, compare professionals, and book appointments without
              hassle. We bring veterinary and grooming care into one reliable platform so your pet gets timely, consistent
              support.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-xl border border-[#DED7CB] bg-[#FFFDF9] p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#EFE8DC] border border-[#DED7CB] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#2F3A34]" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-6 md:py-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="rounded-2xl border border-[#DED7CB] bg-[#FFFDF9] p-7 md:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">Our mission</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  We built PetPerfect to remove the stress from pet healthcare planning. Instead of juggling calls, messages,
                  and scattered information, pet owners can find services, review professional profiles, and make bookings in
                  one place.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Our platform supports routine checkups, vaccinations, and grooming with a process that is transparent,
                  accessible, and easy to follow.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[#DED7CB] bg-[#F6F2EA] p-4">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 text-[#465D4C] mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Veterinary support made accessible</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Discover qualified vets and schedule consultations based on your needs.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-[#DED7CB] bg-[#F6F2EA] p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#465D4C] mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Grooming with consistency</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Keep your pet comfortable and healthy with reliable grooming appointments.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-[#DED7CB] bg-[#F6F2EA] p-4">
                  <div className="flex items-start gap-3">
                    <HeartHandshake className="w-5 h-5 text-[#465D4C] mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Care built around trust</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        We prioritize reliable service quality and a smooth experience for owners and professionals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-r from-[#5E7A64] via-[#526C58] to-[#465D4C] text-white">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">Committed to better pet care every day</h2>
          <p className="text-[#EAF4EC] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            PetPerfect continues to improve scheduling, service discovery, and communication so every pet owner can access
            quality care with confidence.
          </p>
        </div>
      </section>
    </div>
  );
}
