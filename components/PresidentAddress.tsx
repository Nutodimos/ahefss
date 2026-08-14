'use client';

import React, { useState } from 'react';
import { AcademicSession, ExecutiveMember } from '@/lib/types';
import { Quote, ChevronRight, Award } from 'lucide-react';
import { PRESIDENT_SPEECH_PHOTO_URL } from '@/lib/assets';

interface PresidentAddressProps {
  session: AcademicSession;
  president?: ExecutiveMember;
  welcomeMessage?: string;
}

export default function PresidentAddress({
  session,
  president,
  welcomeMessage,
}: PresidentAddressProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const presidentName = president?.full_name || (session.is_pioneer ? 'Abdulwarees' : 'President');
  const photoUrl = PRESIDENT_SPEECH_PHOTO_URL;
  
  const defaultMessage = welcomeMessage || (session.is_pioneer
    ? `Welcome, AHEFFSITES!\nOn behalf of the founding team of The Elevation Era, I am thrilled to welcome you to the official digital portal of the Association of Home Economics and Food Science Students (AHEFSS).\n\nWhen this administration took office, our core mission was encapsulated in our name: to elevate the standard of our department across all fronts. Achieving this was no small task, but by God's grace and through the unwavering support of our Head of Department, our Staff Adviser, our esteemed lecturers, a dedicated executive council, and the entire AHEFSSITE body, we were able to push boundaries and do better.\n\nThe creation of this website stems from a critical challenge we identified: a persistent gap in information regarding the association's work. For too long, many students were unaware of the association's active presence, let alone the impactful programs and events being organized for their growth. This lack of awareness often led to low participation, and worse, left many of our finest achievements lost to time without a historical record.\n\nWe built this platform to change that narrative permanently. Even as we work toward building higher student engagement, every AHEFSSITE deserves to know that programs are being actively executed for their academic, professional, and social development. This platform serves three vital purposes:\n\n1. A Living Showcase: To bring visibility to every event, workshop, and project carried out for the benefit of our students.\n2. A Permanent Legacy Archive: To ensure that the history, hard work, and milestones of our association are preserved for years to come—far beyond traditional paper handover forms.\n3. A Blueprint for Future Leadership: To provide incoming administrations with a clear view of what has been accomplished, setting a benchmark that inspires higher participation and even greater achievements in every new academic session.\n\nThis portal represents the bedrock of our legacy. As you explore the achievements of The Elevation Era, I hope it fills you with pride in our department and inspires you to actively engage with the association moving forward.\n\nWelcome aboard, and keep elevating!`
    : `Welcome to the official portal for the ${session.session_code} academic session (${session.theme_title}). We are committed to fostering excellence, innovation, and unity among all student members of our department.`);

  const paragraphs = defaultMessage.split('\n\n');
  const initialParagraphs = paragraphs.slice(0, 3);
  const remainingParagraphs = paragraphs.slice(3);

  return (
    <section id="president" className="py-16 md:py-24 relative overflow-hidden bg-watermark border-b border-[#C9A227]/20">
      
      {/* Subtle Background Accent Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A4D2E]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A4D2E]/10 border border-[#C9A227]/40 text-[#1A4D2E] text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{session.theme_title} ({session.session_code})</span>
          </div>
          <h2 className="font-ceremonial text-4xl sm:text-5xl font-bold text-[#1A4D2E]">
            President's Address
          </h2>
          <div className="w-24 h-1 bg-[#C9A227] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Content Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#C9A227]/30 relative">
          
          <Quote className="absolute top-6 right-8 w-16 h-16 text-[#C9A227]/15 pointer-events-none hidden sm:block" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Circular President Image with Gold Ring */}
            <div className="flex-shrink-0 text-center w-full md:w-60 flex flex-col items-center">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-[#C9A227] via-[#1A4D2E] to-[#C9A227] shadow-lg mx-auto">
                <img
                  src={photoUrl}
                  alt={presidentName}
                  className="w-full h-full object-cover object-top rounded-full ring-2 ring-white"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-ceremonial text-xl sm:text-2xl font-bold text-[#1A4D2E]">
                  {presidentName}
                </h3>
                <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider mt-1">
                  President ({session.theme_title})
                </p>
                <p className="text-xs text-gray-500 font-medium">AHEFSS Administration</p>
              </div>
            </div>

            {/* Address Text */}
            <div className="flex-1 space-y-4 text-[#1A1A1A] leading-relaxed text-sm sm:text-base">
              
              {initialParagraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line text-gray-700">
                  {p}
                </p>
              ))}

              {remainingParagraphs.length > 0 && (
                <>
                  {isExpanded && (
                    <div className="space-y-4 pt-2 border-t border-gray-100 transition-all duration-300">
                      {remainingParagraphs.map((p, idx) => (
                        <p key={idx} className="whitespace-pre-line text-gray-700">
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1A4D2E] hover:text-[#0F3320] underline underline-offset-4 cursor-pointer pt-2"
                  >
                    <span>{isExpanded ? 'Read Less' : 'Read Full Vision & Welcome Statement'}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
                  </button>
                </>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
