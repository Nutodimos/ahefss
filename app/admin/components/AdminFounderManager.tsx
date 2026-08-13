'use client';

import React, { useState } from 'react';
import { Founder } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';
import { Sparkles, Save, Check } from 'lucide-react';

interface AdminFounderManagerProps {
  founder: Founder;
  onRefresh: () => void;
}

export default function AdminFounderManager({
  founder,
  onRefresh,
}: AdminFounderManagerProps) {
  const [fullName, setFullName] = useState(founder.full_name || 'Abdulwarees');
  const [title, setTitle] = useState(founder.title || 'Pioneer President, The Elevation Era');
  const [photoUrl, setPhotoUrl] = useState(founder.photo_url || '/assets/logo.jpg');
  const [message, setMessage] = useState(founder.message || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  async function handleSaveFounder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(false);

    const updated = {
      id: founder.id || '11111111-1111-1111-1111-111111111111',
      full_name: fullName.trim(),
      title: title.trim(),
      photo_url: photoUrl.trim(),
      message: message.trim(),
    };

    if (supabase) {
      await supabase.from('founder').upsert([updated]);
    }

    setLoading(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
    onRefresh();
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#C9A227]/40 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#C9A227]" />
        <div>
          <h3 className="font-ceremonial text-2xl font-bold text-[#1A4D2E]">
            Global Founder Credit Configuration
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            This singleton record renders permanently on every session view in the footer and vision statement.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Founder Credit Configuration Saved Successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveFounder} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Founder Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Title / Role Line
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs"
            />
          </div>
        </div>

        <CloudinaryUploadWidget
          label="Founder Headshot Photo"
          value={photoUrl}
          onChange={(url) => setPhotoUrl(url)}
        />

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Permanent Founder Vision & Handover Statement
          </label>
          <textarea
            rows={8}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4 text-[#C9A227]" />
            <span>{loading ? 'Saving...' : 'Save Global Founder Credit'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
