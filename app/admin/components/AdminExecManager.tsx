'use client';

import React, { useState } from 'react';
import { AcademicSession, ExecutiveMember } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';
import { Lock, Plus, Trash2, Check, ShieldAlert, Edit2, X, ArrowUp, ArrowDown } from 'lucide-react';

interface AdminExecManagerProps {
  session: AcademicSession;
  executives: ExecutiveMember[];
  onRefresh: () => void;
}

function formatWhatsAppUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return 'https://wa.me/2348000000000';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  let digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '234' + digits.substring(1);
  } else if (!digits.startsWith('234')) {
    digits = '234' + digits;
  }
  return `https://wa.me/${digits}`;
}

export default function AdminExecManager({
  session,
  executives,
  onRefresh,
}: AdminExecManagerProps) {
  const [editingExecId, setEditingExecId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [photoUrl, setPhotoUrl] = useState('/assets/logo.jpg');
  const [bioQuote, setBioQuote] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const isLocked = session.is_pioneer;

  function resetForm() {
    setEditingExecId(null);
    setFullName('');
    setPosition('');
    setPhotoUrl('/assets/logo.jpg');
    setBioQuote('');
    setWhatsappUrl('');
    setDisplayOrder(executives.length + 1);
  }

  function handleEditClick(exec: ExecutiveMember) {
    setEditingExecId(exec.id);
    setFullName(exec.full_name);
    setPosition(exec.office_position);
    setPhotoUrl(exec.photo_url || '/assets/logo.jpg');
    setBioQuote(exec.bio_quote || '');
    setWhatsappUrl(exec.whatsapp_url || '');
    setDisplayOrder(exec.display_order);
  }

  async function handleSaveExec(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);

    const execPayload = {
      session_id: session.id,
      full_name: fullName.trim(),
      office_position: position.trim(),
      display_order: Number(displayOrder) || (executives.length + 1),
      photo_url: photoUrl,
      bio_quote: bioQuote.trim(),
      whatsapp_url: formatWhatsAppUrl(whatsappUrl),
    };

    if (supabase) {
      if (editingExecId) {
        await supabase.from('executive_members').update(execPayload).eq('id', editingExecId);
      } else {
        await supabase.from('executive_members').insert([{ id: crypto.randomUUID(), ...execPayload }]);
      }
    }

    resetForm();
    setLoading(false);
    onRefresh();
  }

  async function handleDeleteExec(id: string, name: string) {
    if (isLocked) return;
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    if (supabase) {
      await supabase.from('executive_members').delete().eq('id', id);
    }
    onRefresh();
  }

  async function handleReorder(exec: ExecutiveMember, direction: 'up' | 'down') {
    if (isLocked || !supabase) return;
    const currentIndex = executives.findIndex((e) => e.id === exec.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= executives.length) return;

    const otherExec = executives[targetIndex];
    await Promise.all([
      supabase.from('executive_members').update({ display_order: otherExec.display_order }).eq('id', exec.id),
      supabase.from('executive_members').update({ display_order: exec.display_order }).eq('id', otherExec.id),
    ]);
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

      {/* Executive Member Form (Create / Edit) */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A4D2E] uppercase tracking-wider flex items-center gap-2">
            {editingExecId ? <Edit2 className="w-4 h-4 text-[#C9A227]" /> : <Plus className="w-4 h-4 text-[#C9A227]" />}
            <span>{editingExecId ? 'Edit Executive Member' : `Add Executive Member (${session.session_code})`}</span>
          </h3>

          {editingExecId && (
            <button
              onClick={resetForm}
              className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSaveExec} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              placeholder="WhatsApp Number or Link (e.g. 08012345678)"
              value={whatsappUrl}
              onChange={(e) => setWhatsappUrl(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />

            <input
              type="number"
              disabled={isLocked}
              placeholder="Display Order (1, 2, 3...)"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
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

          <div className="flex justify-end gap-3">
            {editingExecId && (
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
              className="px-5 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'Locked (Pioneer Session)' : editingExecId ? 'Update Member' : 'Save Executive Member'}</span>
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
          {executives.map((exec, idx) => (
            <div key={exec.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5">{exec.display_order}</span>
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleReorder(exec, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(exec, 'down')}
                    disabled={idx === executives.length - 1}
                    className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditClick(exec)}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                    title="Edit Member"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExec(exec.id, exec.full_name)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete Member"
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
