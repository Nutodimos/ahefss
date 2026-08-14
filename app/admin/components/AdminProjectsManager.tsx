'use client';

import React, { useState } from 'react';
import { AcademicSession, ProjectItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';
import { Lock, Plus, Trash2, ShieldAlert, Edit2, X, Check, ArrowUp, ArrowDown } from 'lucide-react';

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
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('/assets/department_project.jpg');
  const [summaryText, setSummaryText] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const isLocked = session.is_pioneer;

  function resetForm() {
    setEditingProjectId(null);
    setTitle('');
    setCoverUrl('/assets/department_project.jpg');
    setSummaryText('');
    setGallery([]);
    setDisplayOrder(projects.length + 1);
  }

  function handleEditClick(proj: ProjectItem) {
    setEditingProjectId(proj.id);
    setTitle(proj.title);
    setCoverUrl(proj.cover_image_url || '/assets/department_project.jpg');
    setSummaryText(proj.summary_text || '');
    setGallery(proj.photo_gallery || []);
    setDisplayOrder(proj.display_order || projects.length + 1);
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);

    const projectPayload = {
      session_id: session.id,
      title: title.trim(),
      cover_image_url: coverUrl.trim(),
      summary_text: summaryText.trim(),
      photo_gallery: gallery,
      display_order: Number(displayOrder) || (projects.length + 1),
    };

    if (supabase) {
      if (editingProjectId) {
        await supabase.from('projects').update(projectPayload).eq('id', editingProjectId);
      } else {
        await supabase.from('projects').insert([{ id: crypto.randomUUID(), ...projectPayload }]);
      }
    }

    resetForm();
    setLoading(false);
    onRefresh();
  }

  async function handleDeleteProject(id: string, projectTitle: string) {
    if (isLocked) return;
    if (!window.confirm(`Are you sure you want to delete the project "${projectTitle}"?`)) return;

    if (supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }
    onRefresh();
  }

  async function handleReorder(proj: ProjectItem, direction: 'up' | 'down') {
    if (isLocked || !supabase) return;
    const currentIndex = projects.findIndex((p) => p.id === proj.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const otherProj = projects[targetIndex];
    await Promise.all([
      supabase.from('projects').update({ display_order: otherProj.display_order }).eq('id', proj.id),
      supabase.from('projects').update({ display_order: proj.display_order }).eq('id', otherProj.id),
    ]);
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

      {/* Add / Edit Project Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A4D2E] uppercase tracking-wider flex items-center gap-2">
            {editingProjectId ? <Edit2 className="w-4 h-4 text-[#C9A227]" /> : <Plus className="w-4 h-4 text-[#C9A227]" />}
            <span>{editingProjectId ? 'Edit Project Details & Gallery' : `Add New Infrastructure Project (${session.session_code})`}</span>
          </h3>

          {editingProjectId && (
            <button
              onClick={resetForm}
              className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSaveProject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                disabled={isLocked}
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
              />
            </div>

            <div>
              <input
                type="number"
                disabled={isLocked}
                placeholder="Display Order (1, 2...)"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
              />
            </div>
          </div>

          <CloudinaryUploadWidget
            label="Project Cover Image"
            value={coverUrl}
            onChange={(url) => setCoverUrl(url)}
          />

          <textarea
            required
            disabled={isLocked}
            rows={3}
            placeholder="Project Case Study & Overview"
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
          />

          {/* Multi-Image Gallery Uploader */}
          <CloudinaryUploadWidget
            label="Project Documentation Images (Batch Upload & Individual Removes)"
            multiple={true}
            gallery={gallery}
            onGalleryChange={(urls) => setGallery(urls)}
          />

          <div className="flex justify-end gap-3">
            {editingProjectId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLocked || loading}
              className="px-5 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] disabled:opacity-40 cursor-pointer shadow-md flex items-center gap-1.5"
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'Locked (Pioneer Session)' : editingProjectId ? 'Update Project' : 'Save Project'}</span>
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
          {projects.map((proj, idx) => (
            <div key={proj.id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-4 bg-[#FDFDF8]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5">{proj.display_order}</span>
                <img
                  src={getOptimizedImageUrl(proj.cover_image_url, { type: 'gallery', width: 200 })}
                  alt={proj.title}
                  className="w-16 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                />
                <div>
                  <div className="text-sm font-bold text-gray-900">{proj.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">{proj.summary_text}</div>
                </div>
              </div>

              {!isLocked && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleReorder(proj, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(proj, 'down')}
                    disabled={idx === projects.length - 1}
                    className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditClick(proj)}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id, proj.title)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
