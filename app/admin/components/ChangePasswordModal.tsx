'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { KeyRound, X, Check, Loader2 } from 'lucide-react';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    if (supabase) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
    }

    setSuccessMsg(true);
    setLoading(false);
    setTimeout(() => {
      onClose();
    }, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C9A227] relative animate-fadeIn">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-[#1A4D2E]/10 text-[#1A4D2E]">
            <KeyRound className="w-6 h-6 text-[#C9A227]" />
          </div>
          <div>
            <h3 className="font-ceremonial text-2xl font-bold text-[#1A4D2E]">
              Change Admin Password
            </h3>
            <p className="text-xs text-gray-500 font-medium">Update your account credentials</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Password updated successfully! Closing...</span>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
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
                className="px-5 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
