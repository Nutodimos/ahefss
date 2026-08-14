'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectItem } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { FolderGit2, CheckCircle2, Layers, Image as ImageIcon, X } from 'lucide-react';

interface OurProjectsProps {
  projects: ProjectItem[];
  themeTitle: string;
}

export default function OurProjects({ projects, themeTitle }: OurProjectsProps) {
  const [activePhoto, setActivePhoto] = useState<{ url: string; title: string } | null>(null);

  const sortedProjects = [...projects].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="projects" className="py-16 md:py-24 bg-white border-b border-[#C9A227]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A4D2E]/10 border border-[#C9A227]/40 text-[#1A4D2E] text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderGit2 className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Legacy & Development</span>
          </div>
          <h2 className="font-ceremonial text-4xl sm:text-5xl font-bold text-[#1A4D2E]">
            Our Projects
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Tangible infrastructure, academic initiatives, and departmental legacy projects executed during {themeTitle}.
          </p>
          <div className="w-24 h-1 bg-[#C9A227] mx-auto mt-4 rounded-full"></div>
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
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0, 0, 0.2, 1] }}
                  whileHover={{ boxShadow: '0 25px 50px -12px rgba(26, 77, 46, 0.15)' }}
                  className="bg-[#FDFDF8] rounded-3xl p-6 sm:p-10 border border-[#C9A227]/30 shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Distinct Case-Study Badge */}
                  <div className="absolute top-0 right-0 bg-[#C9A227] text-[#1A4D2E] text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-sm">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Case Study / Infrastructure</span>
                  </div>

                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                    
                    {/* Cover Image Side */}
                    <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <motion.div
                        className="relative rounded-2xl overflow-hidden shadow-md border-2 border-white ring-gold"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={getOptimizedImageUrl(project.cover_image_url, { type: 'gallery', width: 1200 })}
                          alt={project.title}
                          className="w-full h-72 sm:h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
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
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
                            <span>Project Documentation ({project.photo_gallery.length})</span>
                          </h4>
                          <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            {project.photo_gallery.map((photo, pIdx) => (
                              <motion.button
                                key={pIdx}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActivePhoto({ url: photo, title: project.title })}
                                className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-[#C9A227] flex-shrink-0 cursor-pointer transition-colors"
                              >
                                <img
                                  src={getOptimizedImageUrl(photo, { type: 'gallery', width: 300 })}
                                  alt={`Project documentation ${pIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
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

      {/* Single Photo Viewer Modal with AnimatePresence */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-4xl max-h-[85vh] bg-white rounded-2xl p-2 overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={getOptimizedImageUrl(activePhoto.url, { type: 'gallery', width: 1600 })}
                alt={activePhoto.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
              <div className="p-3 text-center text-xs font-semibold text-[#1A4D2E]">
                {activePhoto.title} — Documentation Photo
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
