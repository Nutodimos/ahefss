'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectItem } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { FolderGit2, CheckCircle2, Layers, Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface OurProjectsProps {
  projects: ProjectItem[];
  themeTitle: string;
}

export default function OurProjects({ projects, themeTitle }: OurProjectsProps) {
  // Lightbox state for project galleries
  const [activeProject, setActiveProject] = useState<{
    title: string;
    photos: string[];
    currentIndex: number;
  } | null>(null);

  const sortedProjects = [...projects].sort((a, b) => a.display_order - b.display_order);

  // Keyboard navigation for fullscreen project lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!activeProject) return;
      if (e.key === 'Escape') {
        setActiveProject(null);
      } else if (e.key === 'ArrowRight') {
        setActiveProject((prev) =>
          prev
            ? {
                ...prev,
                currentIndex: (prev.currentIndex + 1) % prev.photos.length,
              }
            : null
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveProject((prev) =>
          prev
            ? {
                ...prev,
                currentIndex: (prev.currentIndex - 1 + prev.photos.length) % prev.photos.length,
              }
            : null
        );
      }
    },
    [activeProject]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openProjectLightbox = (project: ProjectItem, startIndex: number = 0) => {
    // Deduplicate cover + gallery photos into a unified ordered list
    const allPhotos: string[] = [];
    if (project.cover_image_url) {
      allPhotos.push(project.cover_image_url);
    }
    if (project.photo_gallery && project.photo_gallery.length > 0) {
      project.photo_gallery.forEach((url) => {
        if (!allPhotos.includes(url)) {
          allPhotos.push(url);
        }
      });
    }

    if (allPhotos.length === 0) return;

    setActiveProject({
      title: project.title,
      photos: allPhotos,
      currentIndex: Math.min(startIndex, allPhotos.length - 1),
    });
  };

  return (
    <section id="projects" className="py-16 md:py-24 bg-white border-b border-[#C9A227]/20 scroll-mt-20 overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.21, 0.45, 0.27, 0.9] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A4D2E]/10 border border-[#C9A227]/40 text-[#1A4D2E] text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderGit2 className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Legacy & Development</span>
          </div>
          <h2 className="font-ceremonial text-4xl sm:text-5xl font-bold text-[#1A4D2E]">
            Our Projects
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Tangible infrastructure, academic initiatives, and departmental legacy projects executed during {themeTitle}. Click any photo to view full-screen and browse documentation.
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-[#C9A227] mx-auto mt-4 rounded-full origin-center"
          ></motion.div>
        </motion.div>

        {sortedProjects.length === 0 ? (
          <div className="text-center py-12 bg-[#FDFDF8] rounded-3xl border border-gray-200">
            <p className="text-gray-500 font-medium">No projects listed for this session.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedProjects.map((project, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.55, ease: [0.21, 0.45, 0.27, 0.9] }}
                  whileHover={{ boxShadow: '0 25px 50px -12px rgba(26, 77, 46, 0.15)' }}
                  className="bg-[#FDFDF8] rounded-3xl p-6 sm:p-10 border border-[#C9A227]/30 shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Distinct Case-Study Badge */}
                  <div className="absolute top-0 right-0 bg-[#C9A227] text-[#1A4D2E] text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-sm z-10">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Case Study / Infrastructure</span>
                  </div>

                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                    
                    {/* Expandable Cover Image Side */}
                    <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <motion.div
                        className="group relative rounded-2xl overflow-hidden shadow-md border-2 border-white ring-gold cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => openProjectLightbox(project, 0)}
                      >
                        <img
                          src={getOptimizedImageUrl(project.cover_image_url, { type: 'gallery', width: 1200 })}
                          alt={project.title}
                          className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Hover / Touch Expand Badge Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                          <span className="bg-[#1A4D2E]/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#C9A227]/40 flex items-center gap-1.5 shadow-md">
                            <Maximize2 className="w-3.5 h-3.5 text-[#C9A227]" />
                            <span>Click to Expand Fullscreen</span>
                          </span>
                          {project.photo_gallery && project.photo_gallery.length > 0 && (
                            <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90">
                              {project.photo_gallery.length + 1} Photos
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Content & Details Side */}
                    <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      
                      <div>
                        <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
                          Project #{index + 1}
                        </span>
                        <h3 className="font-ceremonial text-3xl font-bold text-[#1A4D2E] mt-1">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {project.summary_text}
                      </p>

                      {/* Highlights / Features */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#1A4D2E] bg-white p-3 rounded-xl border border-gray-200">
                          <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                          <span>Permanent Legacy</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#1A4D2E] bg-white p-3 rounded-xl border border-gray-200">
                          <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                          <span>Student Impact Scope</span>
                        </div>
                      </div>

                      {/* Photo Gallery Thumbnails */}
                      {project.photo_gallery && project.photo_gallery.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
                              <span>Project Documentation ({project.photo_gallery.length + 1} photos)</span>
                            </h4>
                            <span className="text-[11px] text-[#1A4D2E] font-semibold">Tap to view</span>
                          </div>
                          
                          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                            {/* Include Cover as Thumbnail 1 */}
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openProjectLightbox(project, 0)}
                              className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#C9A227] flex-shrink-0 cursor-pointer shadow-sm group"
                              title="Cover Photo"
                            >
                              <img
                                src={getOptimizedImageUrl(project.cover_image_url, { type: 'gallery', width: 200 })}
                                alt={`${project.title} cover`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </motion.button>

                            {/* Additional Documentation Photos */}
                            {project.photo_gallery.map((photo, pIdx) => (
                              <motion.button
                                key={pIdx}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openProjectLightbox(project, pIdx + 1)}
                                className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 hover:border-[#C9A227] flex-shrink-0 cursor-pointer shadow-sm group"
                                title={`Documentation Photo ${pIdx + 1}`}
                              >
                                <img
                                  src={getOptimizedImageUrl(photo, { type: 'gallery', width: 200 })}
                                  alt={`Project documentation ${pIdx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Fullscreen Interactive Multi-Photo Lightbox Slider */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
            onClick={() => setActiveProject(null)}
          >
            {/* Top Bar Header */}
            <div
              className="w-full max-w-6xl flex items-center justify-between text-white py-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0 flex-1 pr-4">
                <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
                  Project Gallery
                </span>
                <h3 className="font-ceremonial text-base sm:text-xl font-bold truncate text-white">
                  {activeProject.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-medium text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  {activeProject.currentIndex + 1} / {activeProject.photos.length}
                </span>
                <button
                  onClick={() => setActiveProject(null)}
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
              {/* Previous Arrow */}
              {activeProject.photos.length > 1 && (
                <button
                  onClick={() =>
                    setActiveProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            currentIndex:
                              (prev.currentIndex - 1 + prev.photos.length) % prev.photos.length,
                          }
                        : null
                    )
                  }
                  className="absolute left-2 sm:left-4 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#1A4D2E] text-white border border-white/20 transition-colors cursor-pointer shadow-xl backdrop-blur-sm"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )}

              {/* Main Fullscreen Display Image */}
              <div className="relative max-w-full max-h-[70vh] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeProject.currentIndex}
                    src={getOptimizedImageUrl(activeProject.photos[activeProject.currentIndex], {
                      type: 'gallery',
                      width: 1920,
                    })}
                    alt={`${activeProject.title} photo ${activeProject.currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                  />
                </AnimatePresence>
              </div>

              {/* Next Arrow */}
              {activeProject.photos.length > 1 && (
                <button
                  onClick={() =>
                    setActiveProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            currentIndex: (prev.currentIndex + 1) % prev.photos.length,
                          }
                        : null
                    )
                  }
                  className="absolute right-2 sm:right-4 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#1A4D2E] text-white border border-white/20 transition-colors cursor-pointer shadow-xl backdrop-blur-sm"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Strip */}
            {activeProject.photos.length > 1 && (
              <div
                className="w-full max-w-4xl flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 z-20 scrollbar-thin"
                onClick={(e) => e.stopPropagation()}
              >
                {activeProject.photos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setActiveProject((prev) => (prev ? { ...prev, currentIndex: idx } : null))
                    }
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeProject.currentIndex === idx
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
    </section>
  );
}
