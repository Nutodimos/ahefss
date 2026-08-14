'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventItem } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { X, ChevronLeft, ChevronRight, Calendar, Users, Image as ImageIcon, Sparkles } from 'lucide-react';

interface LightboxModalProps {
  event: EventItem | null;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 12;

export default function LightboxModal({ event, onClose }: LightboxModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const gallery = event?.photo_gallery || [];
  const totalPages = Math.ceil(gallery.length / ITEMS_PER_PAGE);

  // Paginated photo batch for high performance on 100+ image sets
  const paginatedPhotos = gallery.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePhotoIndex !== null) {
          setActivePhotoIndex(null);
        } else {
          onClose();
        }
      } else if (activePhotoIndex !== null) {
        if (e.key === 'ArrowRight') {
          setActivePhotoIndex((prev) =>
            prev === null || prev === gallery.length - 1 ? 0 : prev + 1
          );
        } else if (e.key === 'ArrowLeft') {
          setActivePhotoIndex((prev) =>
            prev === null || prev === 0 ? gallery.length - 1 : prev - 1
          );
        }
      }
    },
    [activePhotoIndex, gallery.length, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#C9A227]/40 my-8 flex flex-col max-h-[90vh]"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1A4D2E] text-white border-b border-[#C9A227]/30 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="bg-[#C9A227] text-[#1A4D2E] text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {event.event_type}
                </span>
                <h3 className="font-ceremonial text-xl sm:text-2xl font-bold truncate max-w-lg">
                  {event.title}
                </h3>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              
              {/* Main Flyer + Recap Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Flyer Banner */}
                <div className="md:col-span-5 bg-gray-100 rounded-2xl overflow-hidden border border-[#C9A227]/30 shadow-md">
                  <img
                    src={getOptimizedImageUrl(event.flyer_banner_url, { type: 'banner', width: 1200 })}
                    alt={event.title}
                    className="w-full h-auto max-h-[350px] object-cover"
                  />
                </div>

                {/* Event Info & Summary */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5 bg-[#FDFDF8] px-3 py-1.5 rounded-lg border border-gray-200">
                      <Calendar className="w-4 h-4 text-[#C9A227]" />
                      {event.event_date}
                    </span>
                    {event.attendees_count > 0 && (
                      <span className="flex items-center gap-1.5 bg-[#FDFDF8] px-3 py-1.5 rounded-lg border border-gray-200">
                        <Users className="w-4 h-4 text-[#1A4D2E]" />
                        {event.attendees_count}+ Attendees
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Event Recap</h4>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base bg-[#FDFDF8] p-4 rounded-xl border border-gray-100">
                      {event.summary_text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1A4D2E]">
                    <ImageIcon className="w-4 h-4 text-[#C9A227]" />
                    <span>Gallery Photo Count: {gallery.length} Images</span>
                  </div>
                </div>
              </div>

              {/* Photo Gallery Grid with Lazy-Loading / Pagination */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-ceremonial text-2xl font-bold text-[#1A4D2E] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C9A227]" />
                    <span>Event Photo Gallery</span>
                  </h4>
                  {totalPages > 1 && (
                    <div className="text-xs font-medium text-gray-500">
                      Page {currentPage} of {totalPages} ({gallery.length} total)
                    </div>
                  )}
                </div>

                {gallery.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 rounded-xl">
                    No additional gallery photos uploaded for this event yet.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {paginatedPhotos.map((photoUrl, localIdx) => {
                        const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + localIdx;
                        return (
                          <motion.button
                            key={globalIdx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActivePhotoIndex(globalIdx)}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-[#C9A227] shadow-sm transition-all cursor-pointer"
                          >
                            <img
                              src={getOptimizedImageUrl(photoUrl, { type: 'gallery', width: 600 })}
                              alt={`Gallery photo ${globalIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                              View Fullscreen
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Client-Side Pagination Controls inside Modal */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-3 pt-4">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium disabled:opacity-40 hover:bg-gray-100 cursor-pointer"
                        >
                          Previous Batch
                        </button>
                        <span className="text-xs text-gray-600 font-semibold">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                          className="px-3 py-1.5 rounded-lg bg-[#1A4D2E] text-white text-xs font-medium disabled:opacity-40 hover:bg-[#0F3320] cursor-pointer"
                        >
                          Next Batch
                        </button>
                      </div>
                    )}
                  </>
                )}

              </div>

            </div>

          </motion.div>

          {/* Fullscreen Photo Lightbox Slider Overlay */}
          <AnimatePresence>
            {activePhotoIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
              >
                
                {/* Close button */}
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Left Arrow */}
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === null || prev === 0 ? gallery.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Active Image */}
                <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
                  <motion.img
                    key={activePhotoIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    src={getOptimizedImageUrl(gallery[activePhotoIndex], { type: 'gallery', width: 1920 })}
                    alt={`Gallery Image ${activePhotoIndex + 1}`}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/20"
                  />
                  <div className="mt-4 text-white text-sm font-medium">
                    Image {activePhotoIndex + 1} of {gallery.length}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === null || prev === gallery.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
