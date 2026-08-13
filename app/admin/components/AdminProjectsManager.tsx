'use client';

import React, { useState } from 'react';
import { AcademicSession, ProjectItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

interface AdminProjectsManagerProps {
  session: AcademicSession;
  projects: ProjectItem[];
  onRefresh: () => void;
}

export default function AdminProjectsManager({
  session,
  projects,
  onRefresh,
}: AdminProjectsManagerProps) {
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('/assets/department_project.jpg');
  const [summaryText, setSummaryText] = useState('');
  const [galleryUrls, setGalleryUrls] = useState('');
  const [loading, setLoading] = useState(false);

  const isLocked = session.is_pioneer;

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    const photos = galleryUrls.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

    const newProject = {
      id: crypto.randomUUID(),
      session_id: session.id,
      title: title.trim(),
      cover_image_url: coverUrl.trim(),
      summary_text: summaryText.trim(),
      photo_gallery: photos,
      display_order: projects.length + 1,
    };

    if (supabase) {
      await supabase.from('projects').insert([newProject]);
    }

    setTitle('');
    setSummaryText('');
    setGalleryUrls('');
    setLoading(false);
    onRefresh();
  }

  async function handleDeleteProject(id: string) {
    if (isLocked) return;
    if (supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }
    onRefresh();
  }

  return (
    <div className="space-y-6">
      {isLocked && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Pioneer Session Read-Only Lock:</span> Departmental projects recorded for the founding era are permanently write-protected.
          </div>
        </div>
      )}

      {/* Add New Project Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#1A4D2E] uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#C9A227]" />
          <span>Add New Infrastructure Project ({session.session_code})</span>
        </h3>

        <form onSubmit={handleAddProject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              disabled={isLocked}
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />

            <CloudinaryUploadWidget
              label="Project Cover Image"
              value={coverUrl}
              onChange={(url) => setCoverUrl(url)}
            />
          </div>

          <textarea
            required
            disabled={isLocked}
            rows={3}
            placeholder="Project Case Study & Overview"
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
          />

          <CloudinaryUploadWidget
            label="Project Documentation Images (Multiple)"
            value={galleryUrls}
            multiple={true}
            onChange={(url) => setGalleryUrls(url)}
            onMultipleChange={(urls) => {
              const current = galleryUrls ? galleryUrls.split(',').map((s) => s.trim()) : [];
              setGalleryUrls([...current, ...urls].join(', '));
            }}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLocked || loading}
              className="px-5 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] disabled:opacity-40 cursor-pointer shadow-md"
            >
              {isLocked ? 'Locked (Pioneer Session)' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Recorded Projects ({projects.length})
        </h4>

        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-4 bg-[#FDFDF8]">
              <div className="flex items-center gap-3">
                <img
                  src={getOptimizedImageUrl(proj.cover_image_url, { type: 'gallery', width: 200 })}
                  alt={proj.title}
                  className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                />
                <div>
                  <div className="text-sm font-bold text-gray-900">{proj.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">{proj.summary_text}</div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
