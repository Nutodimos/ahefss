'use client';

import React, { useState } from 'react';
import { AcademicSession, ExecutiveMember } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';
import { Lock, Plus, Trash2, Check, ShieldAlert } from 'lucide-react';

interface AdminExecManagerProps {
  session: AcademicSession;
  executives: ExecutiveMember[];
  onRefresh: () => void;
}

export default function AdminExecManager({
  session,
  executives,
  onRefresh,
}: AdminExecManagerProps) {
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [photoUrl, setPhotoUrl] = useState('/assets/logo.jpg');
  const [bioQuote, setBioQuote] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const isLocked = session.is_pioneer;

  async function handleAddExec(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    const newExec = {
      id: crypto.randomUUID(),
      session_id: session.id,
      full_name: fullName.trim(),
      office_position: position.trim(),
      display_order: executives.length + 1,
      photo_url: photoUrl,
      bio_quote: bioQuote.trim(),
      whatsapp_url: whatsappUrl.trim() || `https://wa.me/2348000000000`,
    };

    if (supabase) {
      await supabase.from('executive_members').insert([newExec]);
    }

    setFullName('');
    setPosition('');
    setBioQuote('');
    setWhatsappUrl('');
    setLoading(false);
    onRefresh();
  }

  async function handleDeleteExec(id: string) {
    if (isLocked) return;
    if (supabase) {
      await supabase.from('executive_members').delete().eq('id', id);
    }
    onRefresh();
  }

  return (
    <div className="space-y-6">
      
      {/* Pioneer Protection Banner */}
      {isLocked && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Pioneer Session Read-Only Lock Active:</span> The founding administration data is permanently archived and protected at the database RLS level. New additions and edits are disabled.
          </div>
        </div>
      )}

      {/* Add New Executive Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#1A4D2E] uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#C9A227]" />
          <span>Add Executive Member ({session.session_code})</span>
        </h3>

        <form onSubmit={handleAddExec} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              required
              disabled={isLocked}
              placeholder="Full Name (e.g. Jane Doe)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />

            <input
              type="text"
              required
              disabled={isLocked}
              placeholder="Office Position (e.g. Vice President)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />

            <input
              type="text"
              disabled={isLocked}
              placeholder="WhatsApp Link (e.g. https://wa.me/234...)"
              value={whatsappUrl}
              onChange={(e) => setWhatsappUrl(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direct Cloudinary Upload Component */}
            <CloudinaryUploadWidget
              label="Executive Headshot Photo"
              value={photoUrl}
              onChange={(url) => setPhotoUrl(url)}
            />

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Short Bio Quote
              </label>
              <textarea
                disabled={isLocked}
                rows={2}
                placeholder="Short inspirational bio quote"
                value={bioQuote}
                onChange={(e) => setBioQuote(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLocked || loading}
              className="px-5 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'Locked (Pioneer Session)' : 'Save Executive Member'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Executives List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Current Executives ({executives.length})
        </h4>

        <div className="divide-y divide-gray-100">
          {executives.map((exec) => (
            <div key={exec.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={getOptimizedImageUrl(exec.photo_url, { type: 'headshot', width: 100 })}
                  alt={exec.full_name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-[#C9A227]"
                />
                <div>
                  <div className="text-sm font-bold text-gray-900">{exec.full_name}</div>
                  <div className="text-xs text-[#1A4D2E] font-medium">{exec.office_position}</div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={() => handleDeleteExec(exec.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Delete Member"
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
