'use client';

import React, { useState, useEffect } from 'react';
import {
  AcademicSession,
  ExecutiveMember,
  EventItem,
  ProjectItem,
  Lecturer,
} from '@/lib/types';
import {
  supabase,
  MOCK_SESSIONS,
  MOCK_EXECUTIVE_MEMBERS,
  MOCK_EVENTS,
  MOCK_PROJECTS,
  MOCK_LECTURERS,
} from '@/lib/supabase';
import { signOutUser } from '@/lib/auth';

import AdminSessionWizard from './components/AdminSessionWizard';
import AdminExecManager from './components/AdminExecManager';
import AdminEventsManager from './components/AdminEventsManager';
import AdminProjectsManager from './components/AdminProjectsManager';
import AdminLecturersManager from './components/AdminLecturersManager';
import ChangePasswordModal from './components/ChangePasswordModal';

import {
  ShieldCheck,
  Lock,
  PlusCircle,
  Users,
  Calendar,
  FolderGit2,
  GraduationCap,
  ArrowLeft,
  LogOut,
  KeyRound,
  Trash2,
  Star,
  CheckCircle2,
  Archive,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<AcademicSession[]>(MOCK_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<AcademicSession>(MOCK_SESSIONS[0]);

  const [executives, setExecutives] = useState<ExecutiveMember[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  const [activeTab, setActiveTab] = useState<'execs' | 'events' | 'projects' | 'lecturers'>('execs');
  const [showSessionWizard, setShowSessionWizard] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDeletingSession, setIsDeletingSession] = useState(false);
  const [isSettingActive, setIsSettingActive] = useState(false);

  // Defense-in-depth client-side session validation
  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (error || !user) {
          router.replace('/admin/login');
        }
      });
    }
  }, [router]);

  // Fetch initial sessions
  useEffect(() => {
    async function loadAdminData() {
      if (supabase) {
        try {
          const { data: sessionData } = await supabase
            .from('academic_sessions')
            .select('*')
            .order('created_at', { ascending: false });

          const pioneerSession = MOCK_SESSIONS[0];
          const hasPioneer = sessionData?.some((s) => s.id === pioneerSession.id || s.is_pioneer);
          const hasActiveInDb = sessionData?.some((s) => s.is_active);

          // If pioneer session not in remote storage, auto-seed it for permanence
          if (!hasPioneer && sessionData) {
            try {
              await supabase.from('academic_sessions').insert([{
                id: pioneerSession.id,
                session_code: pioneerSession.session_code,
                theme_title: pioneerSession.theme_title,
                is_pioneer: true,
                is_active: !hasActiveInDb,
                created_at: pioneerSession.created_at || new Date().toISOString()
              }]);
            } catch (seedErr) {
              console.warn('Could not auto-seed pioneer session', seedErr);
            }
          }

          const activeSessionData = sessionData ? sessionData.filter((s) => !s.is_archived) : null;

          let combined: AcademicSession[];
          if (hasPioneer) {
            combined = activeSessionData || [];
          } else {
            const fallbackPioneer: AcademicSession = {
              ...pioneerSession,
              is_active: !hasActiveInDb,
            };
            combined = [...(activeSessionData || []), fallbackPioneer];
          }

          let foundActive = false;
          const normalized = combined.map((s) => {
            if (s.is_active && !foundActive) {
              foundActive = true;
              return s;
            }
            return { ...s, is_active: false };
          });
          if (!foundActive && normalized.length > 0) {
            normalized[0].is_active = true;
          }

          setSessions(normalized);
          setSelectedSession((prev) => {
            if (prev && normalized.find((s) => s.id === prev.id)) {
              return normalized.find((s) => s.id === prev.id)!;
            }
            return normalized.find((s) => s.is_active) || normalized[0];
          });
        } catch (err) {
          console.error('Supabase admin fetch error', err);
        }
      }
    }
    loadAdminData();
  }, [refreshTrigger]);

  // Fetch session-scoped content
  useEffect(() => {
    async function loadSessionScopedContent() {
      if (!selectedSession) return;
      const sId = selectedSession.id;

      if (supabase) {
        try {
          const [execRes, eventRes, projectRes, lecRes] = await Promise.all([
            supabase.from('executive_members').select('*').eq('session_id', sId).order('display_order', { ascending: true }),
            supabase.from('events').select('*').eq('session_id', sId).order('event_date', { ascending: false }),
            supabase.from('projects').select('*').eq('session_id', sId).order('display_order', { ascending: true }),
            supabase.from('lecturers').select('*').eq('session_id', sId).order('display_order', { ascending: true }),
          ]);

          const isPioneer = selectedSession.is_pioneer;
          setExecutives(
            execRes.data && execRes.data.length > 0 
              ? execRes.data 
              : isPioneer 
                ? (MOCK_EXECUTIVE_MEMBERS[sId] || MOCK_EXECUTIVE_MEMBERS['22222222-2222-2222-2222-222222222222'] || [])
                : []
          );
          setEvents(
            eventRes.data && eventRes.data.length > 0 
              ? eventRes.data 
              : isPioneer 
                ? (MOCK_EVENTS[sId] || MOCK_EVENTS['22222222-2222-2222-2222-222222222222'] || [])
                : []
          );
          setProjects(
            projectRes.data && projectRes.data.length > 0 
              ? projectRes.data 
              : isPioneer 
                ? (MOCK_PROJECTS[sId] || MOCK_PROJECTS['22222222-2222-2222-2222-222222222222'] || [])
                : []
          );
          setLecturers(
            lecRes.data && lecRes.data.length > 0 
              ? lecRes.data 
              : isPioneer 
                ? (MOCK_LECTURERS[sId] || MOCK_LECTURERS['22222222-2222-2222-2222-222222222222'] || [])
                : []
          );
          return;
        } catch (err) {
          console.error('Supabase fetch error for session content', err);
        }
      }

      setExecutives(MOCK_EXECUTIVE_MEMBERS[sId] || MOCK_EXECUTIVE_MEMBERS['22222222-2222-2222-2222-222222222222'] || []);
      setEvents(MOCK_EVENTS[sId] || MOCK_EVENTS['22222222-2222-2222-2222-222222222222'] || []);
      setProjects(MOCK_PROJECTS[sId] || MOCK_PROJECTS['22222222-2222-2222-2222-222222222222'] || []);
      setLecturers(MOCK_LECTURERS[sId] || MOCK_LECTURERS['22222222-2222-2222-2222-222222222222'] || []);
    }

    loadSessionScopedContent();
  }, [selectedSession, refreshTrigger]);

  function handleSessionCreated(newSession: AcademicSession) {
    setSessions((prev) => [newSession, ...prev]);
    setSelectedSession(newSession);
    setRefreshTrigger((prev) => prev + 1);
  }

  async function handleDeleteSession() {
    if (selectedSession.is_pioneer) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to remove session "${selectedSession.session_code} — ${selectedSession.theme_title}" from the database?`
    );
    if (!confirmDelete) return;

    setIsDeletingSession(true);
    try {
      if (supabase) {
        const { error } = await supabase
          .from('academic_sessions')
          .delete()
          .eq('id', selectedSession.id);

        if (error) {
          alert(`Unable to remove session: ${error.message}`);
          setIsDeletingSession(false);
          return;
        }

        // Ensure pioneer session is set as active
        await supabase
          .from('academic_sessions')
          .update({ is_active: true })
          .eq('id', MOCK_SESSIONS[0].id);
      }

      setSelectedSession(MOCK_SESSIONS[0]);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error removing session', err);
    } finally {
      setIsDeletingSession(false);
    }
  }

  async function handleSetActiveSession() {
    setIsSettingActive(true);
    try {
      if (supabase) {
        await supabase
          .from('academic_sessions')
          .update({ is_active: false })
          .neq('id', selectedSession.id);

        await supabase
          .from('academic_sessions')
          .update({ is_active: true })
          .eq('id', selectedSession.id);
      }

      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          is_active: s.id === selectedSession.id,
        }))
      );
      setSelectedSession((prev) => ({
        ...prev,
        is_active: true,
      }));
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error setting active session', err);
    } finally {
      setIsSettingActive(false);
    }
  }

  async function handleLogout() {
    await signOutUser();
    window.location.href = '/admin/login';
  }

  return (
    <div className="min-h-screen bg-[#FDFDF8] text-[#1A1A1A] flex flex-col">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-[#1A4D2E] text-white border-b-2 border-[#C9A227] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Public Site</span>
              </Link>

              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

              <div>
                <h1 className="font-ceremonial text-2xl font-bold text-[#C9A227] leading-none">
                  AHEFSS Control Panel
                </h1>
                <p className="text-[11px] text-gray-200 mt-0.5">
                  Multi-Session Archival & Content Manager
                </p>
              </div>
            </div>

            {/* Session Selector & Wizard Button */}
            <div className="flex items-center gap-3">
              
              {/* Active Edited Session Selector */}
              <div className="relative">
                <select
                  value={selectedSession.id}
                  onChange={(e) => {
                    const s = sessions.find((item) => item.id === e.target.value);
                    if (s) setSelectedSession(s);
                  }}
                  className="bg-[#0F3320] text-white border border-[#C9A227] rounded-xl px-3 py-2 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.session_code} — {s.theme_title} {s.is_pioneer ? '(Pioneer - Locked)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Create Session Button */}
              <button
                onClick={() => setShowSessionWizard(true)}
                className="px-3.5 py-2 rounded-xl bg-[#C9A227] text-[#1A4D2E] text-xs font-bold hover:bg-[#d6b033] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Session Wizard</span>
              </button>

              {/* Change Password Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Change Password"
              >
                <KeyRound className="w-4 h-4" />
              </button>

              {/* Real Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Selected Session Status Banner */}
        <div className="bg-white rounded-3xl p-6 border border-[#C9A227]/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Editing Session</span>
              {selectedSession.is_pioneer ? (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-700" /> Pioneer Administration (Locked)
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> Standard Editable Session
                </span>
              )}

              {selectedSession.is_active ? (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Landing View
                </span>
              ) : (
                <button
                  onClick={handleSetActiveSession}
                  disabled={isSettingActive}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-[transform,colors] duration-150 active:scale-[0.97] cursor-pointer"
                  title="Make this the default session visitors see first"
                >
                  <Star className="w-3 h-3 text-amber-600" />
                  <span>{isSettingActive ? 'Updating...' : 'Set as Active Landing View'}</span>
                </button>
              )}
            </div>

            <h2 className="font-ceremonial text-3xl font-bold text-[#1A4D2E]">
              {selectedSession.session_code} — {selectedSession.theme_title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                {executives.length} Execs
              </span>
              <span className="bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                {events.length} Events
              </span>
              <span className="bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                {projects.length} Projects
              </span>
            </div>

            {!selectedSession.is_pioneer && (
              <button
                onClick={handleDeleteSession}
                disabled={isDeletingSession}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-[transform,colors] duration-150 active:scale-[0.97] cursor-pointer"
                title="Remove this session from the database"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{isDeletingSession ? 'Removing...' : 'Delete Session'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('execs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'execs'
                ? 'bg-[#1A4D2E] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4 text-[#C9A227]" />
            <span>Executive Cabinet</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#1A4D2E] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#C9A227]" />
            <span>Events & Lightbox Galleries</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#1A4D2E] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-[#C9A227]" />
            <span>Projects & Infrastructures</span>
          </button>

          <button
            onClick={() => setActiveTab('lecturers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'lecturers'
                ? 'bg-[#1A4D2E] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#C9A227]" />
            <span>Lecturers & HOD</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="pt-2">
          {activeTab === 'execs' && (
            <AdminExecManager
              session={selectedSession}
              executives={executives}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            />
          )}

          {activeTab === 'events' && (
            <AdminEventsManager
              session={selectedSession}
              events={events}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjectsManager
              session={selectedSession}
              projects={projects}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            />
          )}

          {activeTab === 'lecturers' && (
            <AdminLecturersManager
              session={selectedSession}
              lecturers={lecturers}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            />
          )}
        </div>

      </main>

      {/* Session Creation Wizard Modal */}
      {showSessionWizard && (
        <AdminSessionWizard
          onSessionCreated={handleSessionCreated}
          onClose={() => setShowSessionWizard(false)}
        />
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
        />
      )}

    </div>
  );
}
