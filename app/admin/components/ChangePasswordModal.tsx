'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { KeyRound, Mail, X, Check, Loader2, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrentUser() {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setCurrentEmail(user.email);
          setNewEmail(user.email);
        }
      }
    }
    loadCurrentUser();
  }, []);

  async function handleAccountUpdate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const updatePayload: { email?: string; password?: string } = {};

    if (newEmail.trim() && newEmail.trim() !== currentEmail) {
      updatePayload.email = newEmail.trim();
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New passwords do not match.');
        return;
      }
      updatePayload.password = newPassword;
    }

    if (Object.keys(updatePayload).length === 0) {
      setErrorMsg('No changes were made.');
      return;
    }

    setLoading(true);

    if (supabase) {
      const { error } = await supabase.auth.updateUser(updatePayload);

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
    }

    setSuccessMsg('Account details updated successfully!');
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
              Account & Credentials
            </h3>
            <p className="text-xs text-gray-500 font-medium">Update email address or password</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleAccountUpdate} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Admin Login / Recovery Email</span>
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@ahefss.org"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
              />
            </div>

            <div className="border-t border-gray-100 pt-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                New Password (leave blank to keep current)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#1A4D2E] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {newPassword.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#1A4D2E] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

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
                <span>{loading ? 'Updating...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
