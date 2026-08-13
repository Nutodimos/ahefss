'use client';

import React, { useState } from 'react';
import { AcademicSession, Lecturer } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { Plus, Trash2, ShieldAlert, Award } from 'lucide-react';

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
  const [fullName, setFullName] = useState('');
  const [isHod, setIsHod] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('/assets/logo.jpg');
  const [loading, setLoading] = useState(false);

  const isLocked = session.is_pioneer;

  async function handleAddLecturer(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);

    const newLecturer = {
      id: crypto.randomUUID(),
      session_id: session.id,
      full_name: fullName.trim(),
      is_hod: isHod,
      photo_url: isHod ? photoUrl : null,
      display_order: lecturers.length + 1,
    };

    if (supabase) {
      await supabase.from('lecturers').insert([newLecturer]);
    }

    setFullName('');
    setIsHod(false);
    setLoading(false);
    onRefresh();
  }

  async function handleDeleteLecturer(id: string) {
    if (isLocked) return;
    if (supabase) {
      await supabase.from('lecturers').delete().eq('id', id);
    }
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

      {/* Add New Lecturer Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#1A4D2E] uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#C9A227]" />
          <span>Add Academic Staff / Lecturer ({session.session_code})</span>
        </h3>

        <form onSubmit={handleAddLecturer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              disabled={isLocked}
              placeholder="Lecturer Full Name & Title (e.g. Dr. A. B. Smith)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />

            <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
              <input
                type="checkbox"
                disabled={isLocked}
                checked={isHod}
                onChange={(e) => setIsHod(e.target.checked)}
                className="w-4 h-4 text-[#1A4D2E] rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-700">Set as Head of Department (HOD)</span>
            </div>
          </div>

          {isHod && (
            <input
              type="text"
              disabled={isLocked}
              placeholder="HOD Photo URL (HOD is featured with photo)"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLocked || loading}
              className="px-5 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] disabled:opacity-40 cursor-pointer"
            >
              {isLocked ? 'Locked (Pioneer Session)' : 'Save Lecturer'}
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
          {lecturers.map((lec) => (
            <div key={lec.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {lec.is_hod ? (
                  <div className="w-8 h-8 rounded-full p-[1px] bg-[#C9A227]">
                    <img
                      src={getOptimizedImageUrl(lec.photo_url || '/assets/logo.jpg', { type: 'headshot', width: 100 })}
                      alt={lec.full_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {lec.display_order}
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
                <button
                  onClick={() => handleDeleteLecturer(lec.id)}
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
