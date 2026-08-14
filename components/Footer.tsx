'use client';

import React, { useState } from 'react';
import { Founder } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { LOGO_URL } from '@/lib/assets';
import { Sparkles, Shield, Heart, X, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  founder: Founder;
}

export default function Footer({ founder }: FooterProps) {
  const [showFounderModal, setShowFounderModal] = useState(false);

  return (
    <footer className="bg-[#0F3320] text-white pt-16 pb-12 border-t-4 border-[#C9A227]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 border-b border-white/10">

          {/* Association Branding */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-gold p-[2px] bg-white">
                <img
                  src={LOGO_URL}
                  alt="AHEFSS Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-ceremonial text-2xl font-bold tracking-tight text-[#C9A227]">
                  AHEFSS ARCHIVAL
                </h3>
                <p className="text-xs text-gray-300">
                  Association of Home Economics & Food Science Students
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-md">
              A multi-session digital legacy portal preserving executive cabinet achievements, project history, and departmental milestones across all academic sessions.
            </p>
          </div>

          {/* Persistent Global Founder Credit Box (NOT session-scoped) */}
          <div className="md:col-span-7 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-[#C9A227]/40 flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-4 text-center sm:text-left">
              {/* Small Circular Photo with Gold Ring */}
              <div className="relative w-14 h-14 rounded-full p-[2px] bg-[#C9A227] shadow-md flex-shrink-0">
                <img
                  src={getOptimizedImageUrl(founder.photo_url || LOGO_URL, { type: 'headshot', width: 200 })}
                  alt={founder.full_name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Founder Credit</span>
                </div>
                <h4 className="font-ceremonial text-lg font-bold text-white">
                  Elevation Era · Founded by {founder.full_name}
                </h4>
                <p className="text-xs text-gray-300">
                  Commissioning Elevation Administration
                </p>
              </div>
            </div>

            {/* Read Vision Button */}
            <button
              onClick={() => setShowFounderModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C9A227] text-[#1A4D2E] text-xs font-bold hover:bg-[#d6b033] transition-colors shadow-md flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Founder's Legacy Vision</span>
            </button>
          </div>

        </div>

        {/* Quick Nav & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6">
            <a href="#president" className="hover:text-[#C9A227] transition-colors">President</a>
            <a href="#executives" className="hover:text-[#C9A227] transition-colors">Execs</a>
            <a href="#events" className="hover:text-[#C9A227] transition-colors">Events</a>
            <a href="#projects" className="hover:text-[#C9A227] transition-colors">Projects</a>
            <a href="#lecturers" className="hover:text-[#C9A227] transition-colors">Lecturers</a>
            <Link href="/admin" className="hover:text-[#C9A227] transition-colors">Admin</Link>
          </div>

          {/* Trademark & Portfolio Link */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
            <span>© {new Date().getFullYear()} AHEFSS. All Rights Reserved.</span>
            <span className="hidden sm:inline">|</span>
            <a
              href="https://somidotun-portfolio.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A227] hover:underline font-semibold flex items-center gap-1 text-xs"
            >
              <span>Developed with excellence by Nutodimos</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

      {/* Founder Vision Statement Modal */}
      {showFounderModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white text-[#1A1A1A] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C9A227] relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowFounderModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full p-[2px] bg-[#C9A227]">
                <img
                  src={getOptimizedImageUrl(founder.photo_url || '/assets/logo.jpg', { type: 'headshot', width: 300 })}
                  alt={founder.full_name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
                  Founder Credit
                </span>
                <h3 className="font-ceremonial text-2xl font-bold text-[#1A4D2E]">
                  {founder.full_name}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  President, The Elevation Era
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700 leading-relaxed bg-[#FDFDF8] p-5 rounded-2xl border border-gray-200 whitespace-pre-line">
              {founder.message || 'Welcome to the AHEFSS legacy platform.'}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowFounderModal(false)}
                className="px-6 py-2 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] transition-colors cursor-pointer"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
