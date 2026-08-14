'use client';

import React, { useState, useEffect } from 'react';
import { AcademicSession } from '@/lib/types';
import { ChevronDown, Lock, Sparkles, UserCheck, Menu, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_LOGO_URL, LOGO_URL } from '@/lib/assets';

interface NavbarProps {
  sessions: AcademicSession[];
  selectedSession: AcademicSession;
  onSelectSession: (session: AcademicSession) => void;
}

const NAV_SECTIONS = [
  { id: 'president', label: 'President' },
  { id: 'executives', label: 'Cabinet' },
  { id: 'events', label: 'Events' },
  { id: 'projects', label: 'Projects' },
  { id: 'lecturers', label: 'Lecturers' },
];

export default function Navbar({
  sessions,
  selectedSession,
  onSelectSession,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('president');

  // ScrollSpy IntersectionObserver to highlight currently active section in view
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = NAV_SECTIONS.map((sec) => document.getElementById(sec.id));
      const scrollPosition = window.scrollY + 120; // Offset for navbar header height

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(NAV_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & Association Branding */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-gold p-[2px] bg-[#1A4D2E] transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
              <img
                src={ADMIN_LOGO_URL}
                alt="AHEFSS Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-ceremonial text-xl sm:text-2xl font-bold tracking-tight text-[#1A4D2E] leading-none">
                AHEFSS
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-[#C9A227] uppercase mt-0.5 flex items-center gap-1">
                <span>Archival</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#C9A227]"></span>
                <span className="font-semibold text-[#1A4D2E] truncate max-w-[110px] sm:max-w-none">{selectedSession.theme_title}</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with ScrollSpy Active Section Highlighting */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/60 border border-[#C9A227]/20 shadow-inner">
            {NAV_SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;

              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${isActive
                    ? 'bg-[#1A4D2E] text-white shadow-sm ring-1 ring-[#C9A227]'
                    : 'text-gray-700 hover:text-[#1A4D2E] hover:bg-gray-100/60'
                    }`}
                >
                  {sec.label}
                </a>
              );
            })}
          </nav>

          {/* Session Switcher Pill & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Session Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-full bg-[#1A4D2E] text-white text-xs font-medium hover:bg-[#0F3320] transition-all shadow-sm ring-1 ring-[#C9A227]/40 cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-label="Select Academic Session"
              >
                {selectedSession.is_active ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active Current Session"></span>
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                )}

                <span className="font-semibold">{selectedSession.session_code}</span>

                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 py-2 z-50 border border-[#C9A227]/30 divide-y divide-gray-100"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Academic Sessions</span>
                    <span className="text-[#1A4D2E] font-semibold text-[10px]">Select session</span>
                  </div>

                  <div className="py-1 max-h-60 overflow-y-auto">
                    {sessions.map((session) => {
                      const isCurrentSelected = session.id === selectedSession.id;

                      return (
                        <button
                          key={session.id}
                          onClick={() => {
                            onSelectSession(session);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${isCurrentSelected
                            ? 'bg-[#1A4D2E]/10 text-[#1A4D2E] font-bold border-l-4 border-[#C9A227]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                              <span>{session.session_code}</span>
                              {session.is_active && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase border border-emerald-300 flex items-center gap-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{session.theme_title}</div>
                          </div>

                          {session.is_pioneer ? (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                              Elevation Era
                            </span>
                          ) : isCurrentSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-[#1A4D2E]" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-[#FDFDF8] border border-[#C9A227] text-[#1A4D2E] hover:bg-[#1A4D2E] hover:text-white transition-all text-xs font-medium flex items-center gap-1.5"
              title="Admin Dashboard"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#1A4D2E] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 px-2 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-xl animate-fadeIn">
            <nav className="flex flex-col space-y-1 text-sm font-semibold text-gray-800">
              {NAV_SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;

                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-xl transition-all flex items-center justify-between ${isActive
                      ? 'bg-[#1A4D2E] text-white font-bold shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    <span>{sec.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#C9A227]"></span>}
                  </a>
                );
              })}
            </nav>
          </div>
        )}

      </div>
    </header>
  );
}
