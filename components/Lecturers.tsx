'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Lecturer } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { ADMIN_LOGO_URL } from '@/lib/assets';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

interface LecturersProps {
  lecturers: Lecturer[];
  themeTitle: string;
}

const listContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Lecturers({ lecturers, themeTitle }: LecturersProps) {
  const hod = lecturers.find((l) => l.is_hod);
  const otherLecturers = lecturers
    .filter((l) => !l.is_hod)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="lecturers" className="py-16 md:py-24 bg-watermark border-b border-[#C9A227]/20 scroll-mt-20 overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.21, 0.45, 0.27, 0.9] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A4D2E]/10 border border-[#C9A227]/40 text-[#1A4D2E] text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Academic Faculty</span>
          </div>
          <h2 className="font-ceremonial text-4xl sm:text-5xl font-bold text-[#1A4D2E]">
            Lecturers & Faculty
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Acknowledging our respected department leadership and academic staff during {themeTitle}.
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-[#C9A227] mx-auto mt-4 rounded-full origin-center"
          ></motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Featured HOD Block */}
          {hod && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.55, ease: [0.21, 0.45, 0.27, 0.9] }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-[#C9A227]/40 text-center relative overflow-hidden active:scale-[0.99]"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1A4D2E] via-[#C9A227] to-[#1A4D2E]"></div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#1A4D2E] text-xs font-bold uppercase tracking-wider mb-6">
                <Award className="w-4 h-4 text-[#C9A227]" />
                <span>Head of Department (HOD)</span>
              </div>

              <div className="flex flex-col items-center">
                {/* HOD Featured Photo Frame with Gold Ring */}
                <motion.div
                  className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-[#C9A227] via-[#1A4D2E] to-[#C9A227] shadow-lg mb-4"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img
                    src={getOptimizedImageUrl(hod.photo_url || ADMIN_LOGO_URL, { type: 'headshot', width: 400 })}
                    alt={hod.full_name}
                    className="w-full h-full object-cover rounded-full ring-2 ring-white"
                  />
                </motion.div>

                <h3 className="font-ceremonial text-3xl font-bold text-[#1A4D2E]">
                  {hod.full_name}
                </h3>
                <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider mt-1">
                  Head of Department · AHEFSS
                </p>
              </div>
            </motion.div>
          )}

          {/* Simple 2-Column Name-Only List for Other Lecturers */}
          {otherLecturers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.5, ease: [0.21, 0.45, 0.27, 0.9] }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-200"
            >
              <h4 className="font-ceremonial text-2xl font-bold text-[#1A4D2E] mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C9A227]" />
                <span>Departmental Academic Staff</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {otherLecturers.map((lec, idx) => (
                  <motion.div
                    key={lec.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.4, delay: (idx % 4) * 0.05, ease: [0.21, 0.45, 0.27, 0.9] }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FDFDF8] border border-gray-100 hover:border-[#C9A227]/40 transition-colors active:scale-[0.98]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1A4D2E]/10 text-[#1A4D2E] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#C9A227]/30">
                      {idx + 1}
                    </div>
                    <span className="font-medium text-sm text-[#1A1A1A]">
                      {lec.full_name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
