'use client';

import React, { useState } from 'react';
import { AcademicSession } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Sparkles, X, Check } from 'lucide-react';

interface AdminSessionWizardProps {
  onSessionCreated: (newSession: AcademicSession) => void;
  onClose: () => void;
}

export default function AdminSessionWizard({
  onSessionCreated,
  onClose,
}: AdminSessionWizardProps) {
  const [sessionCode, setSessionCode] = useState('');
  const [themeTitle, setThemeTitle] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionCode.trim() || !themeTitle.trim()) {
      setErrorMsg('Please enter both the session code and theme title.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const newSessionData = {
      id: crypto.randomUUID(),
      session_code: sessionCode.trim(),
      theme_title: themeTitle.trim(),
      is_pioneer: false,
      is_active: isActive,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      if (isActive) {
        try {
          await supabase
            .from('academic_sessions')
            .update({ is_active: false })
            .neq('id', newSessionData.id);
        } catch (deactErr) {
          console.warn('Could not deactivate existing sessions', deactErr);
        }
      }

      const { data, error } = await supabase
        .from('academic_sessions')
        .insert([newSessionData])
        .select()
        .single();

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      onSessionCreated(data || newSessionData);
    } else {
      onSessionCreated(newSessionData);
    }

    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C9A227] relative animate-fadeIn">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-[#1A4D2E]/10 text-[#1A4D2E]">
            <Sparkles className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div>
            <h3 className="font-ceremonial text-2xl font-bold text-[#1A4D2E]">
              New Academic Session
            </h3>
            <p className="text-xs text-gray-500 font-medium">Session Creation Wizard</p>
          </div>
        </div>

        <form onSubmit={handleCreateSession} className="space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Session Code (e.g. 2026/2027)
            </label>
            <input
              type="text"
              required
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder="2026/2027"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Theme / Administration Title
            </label>
            <input
              type="text"
              required
              value={themeTitle}
              onChange={(e) => setThemeTitle(e.target.value)}
              placeholder="e.g. Excellence Era"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <span className="block text-xs font-bold text-gray-900">Set as Active Homepage Session</span>
              <span className="text-[11px] text-gray-500">Flips previous active session to inactive</span>
            </div>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#1A4D2E] rounded focus:ring-[#1A4D2E] cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Academic Session'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
