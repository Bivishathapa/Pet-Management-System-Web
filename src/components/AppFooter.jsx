import React from 'react';
import {
  Mail,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const features = ['Home', 'Book Appointment', 'Professionals', 'Services', 'About', 'Contact'];
const legal = ['Terms of Use', 'Privacy Policy', 'Cookie Policy', 'Disclaimer', 'Data Safety'];

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#DED7CB] bg-[#FFFDF9] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 md:grid-cols-12 items-start">
            <div className="md:col-span-4">
              <BrandLogo imgClassName="h-14 w-auto max-w-[320px] object-contain object-left" />
              <p className="mt-4 text-slate-600 text-sm leading-relaxed max-w-xs">
                Connect more care and love for your pets.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-[#2F3A34] mb-3">Features</h4>
              <ul className="space-y-2.5">
                {features.map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-600 leading-none">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-sm font-semibold text-[#2F3A34] mb-3">Legal</h4>
              <ul className="space-y-2.5">
                {legal.map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-600 leading-none">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <div className="rounded-xl border border-[#DED7CB] bg-[#F6F2EA] p-5">
                <h4 className="text-xl font-semibold text-[#2F3A34] mb-3">Contact us</h4>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-rose-500" />
                  <span className="text-sm">bivisha456@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#DED7CB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-sm text-slate-600">Copyright © PetPerfect {year}</p>
            <p className="text-sm text-slate-600">All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
