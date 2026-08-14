'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ExecutiveMember } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { MessageSquare, Users, ExternalLink } from 'lucide-react';

interface ExecutiveCabinetProps {
  executives: ExecutiveMember[];
  themeTitle: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] } },
};

export default function ExecutiveCabinet({
  executives,
  themeTitle,
}: ExecutiveCabinetProps) {
  const sortedExecs = [...executives].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="executives" className="py-16 md:py-24 bg-white border-b border-[#C9A227]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <motion.div
          className="text-center mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A4D2E]/10 border border-[#C9A227]/40 text-[#1A4D2E] text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Leadership Council</span>
          </div>
          <h2 className="font-ceremonial text-4xl sm:text-5xl font-bold text-[#1A4D2E]">
            The Executive Cabinet
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            The dedicated team of leaders serving {themeTitle}. Click any member to connect directly via WhatsApp.
          </p>
          <div className="w-24 h-1 bg-[#C9A227] mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* 4-col desktop / 2-col tablet / 1-col mobile Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {sortedExecs.map((exec) => {
            const formattedWhatsApp = exec.whatsapp_url || `https://wa.me/2348000000000?text=Hello%20${encodeURIComponent(exec.full_name)}`;

            return (
              <motion.a
                key={exec.id}
                href={formattedWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(26,77,46,0.15)' }}
                className="group relative bg-[#FDFDF8] rounded-2xl p-5 border border-gray-100 hover:border-[#C9A227]/60 shadow-sm transition-colors duration-300 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Photo with Thin Gold Ring Border */}
                <motion.div
                  className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-br from-[#C9A227] via-emerald-800 to-[#C9A227] shadow-md"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <img
                    src={getOptimizedImageUrl(exec.photo_url, { type: 'headshot', width: 400 })}
                    alt={exec.full_name}
                    className="w-full h-full object-cover rounded-full ring-2 ring-white"
                  />

                  {/* Hover WhatsApp Badge */}
                  <div className="absolute inset-0 rounded-full bg-[#1A4D2E]/80 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1.5 text-white font-semibold text-xs bg-[#25D366] px-3 py-1.5 rounded-full shadow-lg">
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </div>
                  </div>
                </motion.div>

                {/* Position & Name */}
                <div className="mt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#1A4D2E]/10 text-[#1A4D2E] text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-[#C9A227]/30">
                      {exec.office_position}
                    </span>
                    <h3 className="font-ceremonial text-xl font-bold text-[#1A1A1A] group-hover:text-[#1A4D2E] transition-colors">
                      {exec.full_name}
                    </h3>
                  </div>

                  {exec.bio_quote && (
                    <p className="mt-3 text-xs text-gray-500 italic line-clamp-2 px-2">
                      "{exec.bio_quote}"
                    </p>
                  )}

                  {/* Connect Indicator */}
                  <div className="mt-4 pt-3 border-t border-gray-100 w-full flex items-center justify-center gap-1 text-[11px] font-medium text-gray-400 group-hover:text-[#25D366] transition-colors">
                    <span>Contact via WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
