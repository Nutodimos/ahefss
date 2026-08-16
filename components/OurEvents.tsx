'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EventItem } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import LightboxModal from './LightboxModal';
import { Calendar, Users, Images, ArrowUpRight, Sparkles } from 'lucide-react';

interface OurEventsProps {
  events: EventItem[];
  themeTitle: string;
}

export default function OurEvents({ events, themeTitle }: OurEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <section id="events" className="py-16 md:py-24 bg-watermark border-b border-[#C9A227]/20 scroll-mt-20 overflow-hidden w-full max-w-full">
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
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Association Activities</span>
          </div>
          <h2 className="font-ceremonial text-4xl sm:text-5xl font-bold text-[#1A4D2E]">
            Our Events
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Key programs, workshops, and exhibitions hosted during {themeTitle}. Click any card to open the interactive photo gallery.
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-[#C9A227] mx-auto mt-4 rounded-full origin-center"
          ></motion.div>
        </motion.div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <motion.div
            className="text-center py-12 bg-white rounded-3xl border border-gray-200"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-gray-500 font-medium">No events recorded for this session yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => {
              const galleryCount = event.photo_gallery?.length || 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.45, delay: (index % 2) * 0.08, ease: [0.21, 0.45, 0.27, 0.9] }}
                  whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(26, 77, 46, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedEvent(event)}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#C9A227] shadow-md transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.99]"
                >
                  {/* Flyer Banner Header */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-900">
                    <img
                      src={getOptimizedImageUrl(event.flyer_banner_url, { type: 'banner', width: 1200 })}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="bg-[#1A4D2E] text-white text-xs font-semibold px-3 py-1 rounded-full border border-[#C9A227]/40 shadow-sm">
                        {event.event_type}
                      </span>

                      {galleryCount > 0 && (
                        <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                          <Images className="w-3.5 h-3.5 text-[#C9A227]" />
                          <span>{galleryCount} Photos</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Date Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#C9A227] mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{event.event_date}</span>
                      </div>
                      <h3 className="font-ceremonial text-2xl font-bold leading-tight group-hover:text-[#C9A227] transition-colors">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body & Summary */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {event.summary_text}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Users className="w-4 h-4 text-[#1A4D2E]" />
                        <span>{event.attendees_count > 0 ? `${event.attendees_count}+ Attendees` : 'Open Event'}</span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-[#1A4D2E] group-hover:text-[#0F3320] font-bold">
                        <span>Open Lightbox Gallery</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}
