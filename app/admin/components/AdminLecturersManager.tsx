'use client';

import React, { useState } from 'react';
import { AcademicSession, Lecturer } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';
import { Plus, Trash2, ShieldAlert, Edit2, X, Check, ArrowUp, ArrowDown, AlertTriangle, Lock } from 'lucide-react';

interface AdminLecturersManagerProps {
  session: AcademicSession;
  lecturers: Lecturer[];
  onRefresh: () => void;
}

export default function AdminLecturersManager({
  session,
  lecturers,
  onRefresh,
}: AdminLecturersManagerProps) {
  const [editingLecturerId, setEditingLecturerId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [isHod, setIsHod] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('/assets/logo.jpg');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const isLocked = session.is_pioneer;
  const existingHod = lecturers.find((l) => l.is_hod && l.id !== editingLecturerId);

  function resetForm() {
    setEditingLecturerId(null);
    setFullName('');
    setIsHod(false);
    setPhotoUrl('/assets/logo.jpg');
    setDisplayOrder(lecturers.length + 1);
  }

  function handleEditClick(lec: Lecturer) {
    setEditingLecturerId(lec.id);
    setFullName(lec.full_name);
    setIsHod(lec.is_hod);
    setPhotoUrl(lec.photo_url || '/assets/logo.jpg');
    setDisplayOrder(lec.display_order || lecturers.length + 1);
  }

  async function handleSaveLecturer(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);

    const lecturerPayload = {
      session_id: session.id,
      full_name: fullName.trim(),
      is_hod: isHod,
      photo_url: isHod ? photoUrl : null,
      display_order: Number(displayOrder) || (lecturers.length + 1),
    };

    if (supabase) {
      if (editingLecturerId) {
        await supabase.from('lecturers').update(lecturerPayload).eq('id', editingLecturerId);
      } else {
        await supabase.from('lecturers').insert([{ id: crypto.randomUUID(), ...lecturerPayload }]);
      }
    }

    resetForm();
    setLoading(false);
    onRefresh();
  }

  async function handleDeleteLecturer(id: string, name: string) {
    if (isLocked) return;
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    if (supabase) {
      await supabase.from('lecturers').delete().eq('id', id);
    }
    onRefresh();
  }

  async function handleReorder(lec: Lecturer, direction: 'up' | 'down') {
    if (isLocked || !supabase) return;
    const currentIndex = lecturers.findIndex((l) => l.id === lec.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= lecturers.length) return;

    const otherLec = lecturers[targetIndex];
    await Promise.all([
      supabase.from('lecturers').update({ display_order: otherLec.display_order }).eq('id', lec.id),
      supabase.from('lecturers').update({ display_order: lec.display_order }).eq('id', otherLec.id),
    ]);
    onRefresh();
  }

  return (
    <div className="space-y-6">
      {isLocked && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Pioneer Session Read-Only Lock:</span> Faculty records for the founding session are permanently write-protected.
          </div>
        </div>
      )}

      {/* Add / Edit Lecturer Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A4D2E] uppercase tracking-wider flex items-center gap-2">
            {editingLecturerId ? <Edit2 className="w-4 h-4 text-[#C9A227]" /> : <Plus className="w-4 h-4 text-[#C9A227]" />}
            <span>{editingLecturerId ? 'Edit Lecturer / Staff Member' : `Add Academic Staff / Lecturer (${session.session_code})`}</span>
          </h3>

          {editingLecturerId && (
            <button
              onClick={resetForm}
              className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>

        {isHod && existingHod && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Warning: "{existingHod.full_name}" is already designated as HOD for this session.</span>
          </div>
        )}

        <form onSubmit={handleSaveLecturer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                disabled={isLocked}
                placeholder="Lecturer Full Name & Title (e.g. Dr. A. B. Smith)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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

          <div className="flex items-center gap-3 px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50">
            <input
              type="checkbox"
              disabled={isLocked}
              checked={isHod}
              onChange={(e) => setIsHod(e.target.checked)}
              className="w-4 h-4 text-[#1A4D2E] rounded cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-gray-900">Set as Head of Department (HOD)</span>
              <span className="block text-[11px] text-gray-500">HOD entries include a featured headshot photo</span>
            </div>
          </div>

          {/* Photo upload appears ONLY if HOD */}
          {isHod && (
            <CloudinaryUploadWidget
              label="Featured HOD Headshot Photo"
              value={photoUrl}
              onChange={(url) => setPhotoUrl(url)}
            />
          )}

          <div className="flex justify-end gap-3">
            {editingLecturerId && (
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
              <span>{isLocked ? 'Locked (Pioneer Session)' : editingLecturerId ? 'Update Lecturer' : 'Save Lecturer'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lecturers List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Faculty Directory ({lecturers.length})
        </h4>

        <div className="divide-y divide-gray-100">
          {lecturers.map((lec, idx) => (
            <div key={lec.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5">{lec.display_order}</span>
                {lec.is_hod ? (
                  <div className="w-9 h-9 rounded-full p-[1px] bg-[#C9A227] flex-shrink-0">
                    <img
                      src={getOptimizedImageUrl(lec.photo_url || '/assets/logo.jpg', { type: 'headshot', width: 100 })}
                      alt={lec.full_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {idx + 1}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span>{lec.full_name}</span>
                    {lec.is_hod && (
                      <span className="bg-[#C9A227]/20 text-[#1A4D2E] border border-[#C9A227] text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                        HOD
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isLocked && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleReorder(lec, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(lec, 'down')}
                    disabled={idx === lecturers.length - 1}
                    className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditClick(lec)}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                    title="Edit Lecturer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLecturer(lec.id, lec.full_name)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete Lecturer"
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
