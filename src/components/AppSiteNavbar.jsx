import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { dashboardHomePathForRole } from '../constants/dashboardHomeByRole';
import BrandLogo from './BrandLogo';

const linkBase =
  'text-sm font-medium px-2 py-1.5 rounded-md transition-colors text-slate-600 hover:text-[#2F3A34] hover:bg-[#EFE8DC]/80';

const navLinkActive = ({ isActive }) =>
  `${linkBase} ${isActive ? 'text-rose-700 bg-rose-50 font-semibold ring-1 ring-rose-200/60' : ''}`;

/**
 * Light app nav — cream/sage palette like landing & inner pages, but inline links + pill active state
 * (not the landing3-column grid).
 */
export default function AppSiteNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userData = user?.data || user;
  const roleId = userData?.user?.roleId;
  const dashboardPath = dashboardHomePathForRole(roleId);

  const closeMobile = () => setOpen(false);

  const links = (
    <>
      <NavLink to="/" end className={navLinkActive} onClick={closeMobile}>
        Home
      </NavLink>
      <NavLink to="/my-service" className={navLinkActive} onClick={closeMobile}>
        Services
      </NavLink>
      <NavLink to="/about-us" className={navLinkActive} onClick={closeMobile}>
        About
      </NavLink>
      <NavLink to="/professionals" className={navLinkActive} onClick={closeMobile}>
        Professionals
      </NavLink>
      <NavLink to="/book-now" className={navLinkActive} onClick={closeMobile}>
        Book
      </NavLink>
    </>
  );

  const btnOutline =
    'px-4 py-2 rounded-lg border border-[#DED7CB] bg-white text-sm font-medium text-[#2F3A34] hover:bg-[#F6F2EA] transition-colors';
  const btnPrimary =
    'px-4 py-2 rounded-lg bg-[#5E7A64] text-white text-sm font-semibold hover:bg-[#465D4C] shadow-sm transition-colors';

  return (
    <header className="sticky top-0 z-50 border-b border-[#DED7CB] bg-[#FFFDF9]/95 backdrop-blur-sm shadow-sm">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" aria-hidden />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          <BrandLogo
            onClick={() => navigate('/')}
            imgClassName="h-11 sm:h-14 w-auto max-w-[240px] sm:max-w-[300px] object-contain object-left"
          />

          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-1 justify-center min-w-0">
            {links}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <button type="button" onClick={() => navigate(dashboardPath)} className={btnPrimary}>
                Dashboard
              </button>
            ) : (
              <>
                <button type="button" onClick={() => navigate('/login')} className={btnOutline}>
                  Sign in
                </button>
                <button type="button" onClick={() => navigate('/register')} className={btnPrimary}>
                  Get started
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-[#2F3A34] hover:bg-[#EFE8DC]/80"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open ? (
          <div className="md:hidden border-t border-[#DED7CB] py-4 flex flex-col gap-1 pb-5">
            <div className="flex flex-col gap-0.5">{links}</div>
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-[#DED7CB]">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    navigate(dashboardPath);
                  }}
                  className={`w-full ${btnPrimary}`}
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobile();
                      navigate('/login');
                    }}
                    className={`w-full ${btnOutline}`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobile();
                      navigate('/register');
                    }}
                    className={`w-full ${btnPrimary}`}
                  >
                    Get started
                  </button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
