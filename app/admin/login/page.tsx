'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!supabase) {
      setErrorMsg('Database client connection is not configured.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Redirect securely to admin dashboard
    window.location.href = '/admin';
  }

  return (
    <div className="min-h-screen bg-[#FDFDF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-[#C9A227] via-[#1A4D2E] to-[#C9A227] mx-auto shadow-lg mb-3">
            <img src="/assets/logo.jpg" alt="AHEFSS Logo" className="w-full h-full object-cover rounded-full" />
          </div>
        </Link>
        <h2 className="font-ceremonial text-3xl font-bold text-[#1A4D2E]">
          AHEFSS Admin Portal
        </h2>
        <p className="mt-2 text-xs text-gray-600 font-medium">
          Multi-Session Archival Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-3xl border border-[#C9A227]/30 sm:px-10">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ahefss.org"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-[#1A4D2E] hover:bg-[#0F3320] transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
