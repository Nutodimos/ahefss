'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventItem } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { X, ChevronLeft, ChevronRight, Calendar, Users, Image as ImageIcon, Sparkles, Maximize2 } from 'lucide-react';

interface LightboxModalProps {
  event: EventItem | null;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 12;

export default function LightboxModal({ event, onClose }: LightboxModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Unified list of all event photos (flyer + gallery)
  const allPhotos: string[] = React.useMemo(() => {
    if (!event) return [];
    const list: string[] = [];
    if (event.flyer_banner_url) {
      list.push(event.flyer_banner_url);
    }
    if (event.photo_gallery && event.photo_gallery.length > 0) {
      event.photo_gallery.forEach((url) => {
        if (!list.includes(url)) {
          list.push(url);
        }
      });
    }
    return list;
  }, [event]);

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
      } else if (activePhotoIndex !== null && allPhotos.length > 0) {
        if (e.key === 'ArrowRight') {
          setActivePhotoIndex((prev) =>
            prev === null || prev === allPhotos.length - 1 ? 0 : prev + 1
          );
        } else if (e.key === 'ArrowLeft') {
          setActivePhotoIndex((prev) =>
            prev === null || prev === 0 ? allPhotos.length - 1 : prev - 1
          );
        }
      }
    },
    [activePhotoIndex, allPhotos.length, onClose]
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
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#1A4D2E] text-white border-b border-[#C9A227]/30 flex-shrink-0 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <span className="bg-[#C9A227] text-[#1A4D2E] text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md uppercase tracking-wider flex-shrink-0">
                  {event.event_type}
                </span>
                <h3 className="font-ceremonial text-base sm:text-2xl font-bold truncate">
                  {event.title}
                </h3>
              </div>
              
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              
              {/* Main Flyer + Recap Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Expandable Flyer Banner */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActivePhotoIndex(0)}
                  className="md:col-span-5 group relative bg-gray-100 rounded-2xl overflow-hidden border border-[#C9A227]/30 shadow-md cursor-pointer"
                >
                  <img
                    src={getOptimizedImageUrl(event.flyer_banner_url, { type: 'banner', width: 1200 })}
                    alt={event.title}
                    className="w-full h-auto max-h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <Maximize2 className="w-4 h-4 text-[#C9A227]" />
                    <span>Expand Fullscreen</span>
                  </div>
                </motion.div>

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
                    <span>Total Gallery Collection: {allPhotos.length} Photos</span>
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
                        // Find matching index in allPhotos
                        const allIdx = allPhotos.indexOf(photoUrl);
                        const targetIdx = allIdx !== -1 ? allIdx : globalIdx;

                        return (
                          <motion.button
                            key={globalIdx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActivePhotoIndex(targetIdx)}
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

          {/* Fullscreen Photo Lightbox Slider Overlay with Bottom Carousel */}
          <AnimatePresence>
            {activePhotoIndex !== null && allPhotos[activePhotoIndex] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
                onClick={() => setActivePhotoIndex(null)}
              >
                {/* Top Header Bar */}
                <div
                  className="w-full max-w-6xl flex items-center justify-between text-white py-2 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
                      {event.title}
                    </span>
                    <h4 className="font-ceremonial text-base sm:text-xl font-bold truncate text-white">
                      Fullscreen Event Photo
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      {activePhotoIndex + 1} / {allPhotos.length}
                    </span>
                    <button
                      onClick={() => setActivePhotoIndex(null)}
                      className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                      aria-label="Close Fullscreen Lightbox"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>

                {/* Central Stage with Left/Right Arrows */}
                <div
                  className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2 sm:my-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Arrow */}
                  {allPhotos.length > 1 && (
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === null || prev === 0 ? allPhotos.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 sm:left-4 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#1A4D2E] text-white border border-white/20 transition-colors cursor-pointer shadow-xl backdrop-blur-sm"
                      aria-label="Previous Photo"
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                  )}

                  {/* Active Image */}
                  <div className="relative max-w-full max-h-[70vh] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activePhotoIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        src={getOptimizedImageUrl(allPhotos[activePhotoIndex], {
                          type: 'gallery',
                          width: 1920,
                        })}
                        alt={`${event.title} photo ${activePhotoIndex + 1}`}
                        className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Right Arrow */}
                  {allPhotos.length > 1 && (
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === null || prev === allPhotos.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 sm:right-4 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#1A4D2E] text-white border border-white/20 transition-colors cursor-pointer shadow-xl backdrop-blur-sm"
                      aria-label="Next Photo"
                    >
                      <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                  )}
                </div>

                {/* Bottom Thumbnail Carousel Strip */}
                {allPhotos.length > 1 && (
                  <div
                    className="w-full max-w-4xl flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 z-20 scrollbar-thin"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {allPhotos.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                          activePhotoIndex === idx
                            ? 'border-[#C9A227] scale-105 shadow-lg ring-2 ring-[#C9A227]/40'
                            : 'border-white/20 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={getOptimizedImageUrl(photoUrl, { type: 'gallery', width: 200 })}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
