'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!supabase) {
      setErrorMsg('Database connection is not configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('email not confirmed')) {
          setErrorMsg('Email address not confirmed yet! Please go to your Supabase Dashboard -> Authentication -> Users -> click "Confirm Email" for ahefsswork@gmail.com (or disable "Confirm email" under Auth Settings -> Email).');
        } else if (msg.includes('failed to fetch')) {
          setErrorMsg('Failed to connect to Supabase. Please ensure your dev server has loaded .env.local (restart npm run dev).');
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        router.replace('/admin');
        router.refresh();
      } else {
        setErrorMsg('Could not start session. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err?.message || 'Network error: Failed to connect to authentication service.');
      setLoading(false);
    }
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
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D2E]"
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
