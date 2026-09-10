'use client';

import React, { useState, useEffect } from 'react';
import {
  AcademicSession,
  ExecutiveMember,
  EventItem,
  ProjectItem,
  Lecturer,
  Founder,
} from '@/lib/types';
import {
  supabase,
  MOCK_FOUNDER,
  MOCK_SESSIONS,
  MOCK_EXECUTIVE_MEMBERS,
  MOCK_EVENTS,
  MOCK_PROJECTS,
  MOCK_LECTURERS,
} from '@/lib/supabase';

import Navbar from '@/components/Navbar';
import PresidentAddress from '@/components/PresidentAddress';
import ExecutiveCabinet from '@/components/ExecutiveCabinet';
import OurEvents from '@/components/OurEvents';
import OurProjects from '@/components/OurProjects';
import Lecturers from '@/components/Lecturers';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [sessions, setSessions] = useState<AcademicSession[]>(MOCK_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<AcademicSession>(MOCK_SESSIONS[0]);
  
  const pioneerKey = '22222222-2222-2222-2222-222222222222';
  const [executives, setExecutives] = useState<ExecutiveMember[]>(MOCK_EXECUTIVE_MEMBERS[pioneerKey] || []);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS[pioneerKey] || []);
  const [projects, setProjects] = useState<ProjectItem[]>(MOCK_PROJECTS[pioneerKey] || []);
  const [lecturers, setLecturers] = useState<Lecturer[]>(MOCK_LECTURERS[pioneerKey] || []);
  const [founder, setFounder] = useState<Founder>(MOCK_FOUNDER);

  const [loading, setLoading] = useState(true);

  // Fetch initial sessions & founder from Supabase (or fallback to Mock)
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      if (supabase) {
        try {
          // Fetch Founder
          const { data: founderData } = await supabase.from('founder').select('*').limit(1).single();
          if (founderData) setFounder(founderData);

          // Fetch Academic Sessions
          const { data: sessionData } = await supabase
            .from('academic_sessions')
            .select('*')
            .order('created_at', { ascending: false });

          const activeSessionData = sessionData
            ? sessionData.filter((s) => !s.is_archived && s.session_code !== '2026/2027')
            : null;

          if (activeSessionData && activeSessionData.length > 0) {
            const hasPioneer = activeSessionData.some((s) => s.id === MOCK_SESSIONS[0].id || s.is_pioneer);
            const hasActiveInDb = activeSessionData.some((s) => s.is_active);
            
            // Respect whatever session the admin marked active in storage.
            // Only mark the fallback pioneer active if no session in storage is marked active.
            const pioneerFallback: AcademicSession = {
              ...MOCK_SESSIONS[0],
              is_active: !hasActiveInDb,
            };

            const combinedSessions = hasPioneer
              ? activeSessionData
              : [...activeSessionData, pioneerFallback];

            // Strictly enforce that only ONE session has is_active: true
            let foundActive = false;
            const normalizedSessions = combinedSessions.map((s) => {
              if (s.is_active && !foundActive) {
                foundActive = true;
                return s;
              }
              return { ...s, is_active: false };
            });

            if (!foundActive && normalizedSessions.length > 0) {
              normalizedSessions[0].is_active = true;
            }

            setSessions(normalizedSessions);
            const pioneer = normalizedSessions.find((s) => s.is_pioneer || s.id === MOCK_SESSIONS[0].id);
            const active = normalizedSessions.find((s) => s.is_active);
            setSelectedSession(active || pioneer || normalizedSessions[0]);
          } else {
            setSessions(MOCK_SESSIONS);
            setSelectedSession(MOCK_SESSIONS[0]);
          }
        } catch (err) {
          console.error('Error fetching Supabase data, utilizing fallback state', err);
        }
      }
      setLoading(false);
    }

    loadInitialData();
  }, []);

  // Fetch data scoped to the currently selected session
  useEffect(() => {
    async function loadSessionScopedData() {
      if (!selectedSession) return;
      const sId = selectedSession.id;
      const isPioneer = selectedSession.is_pioneer || sId === '22222222-2222-2222-2222-222222222222';

      // Helper: picks Supabase data if non-empty; for pioneer session, falls back to mock data if empty; for new sessions, returns empty array
      const withFallback = <T,>(supabaseData: T[] | null, mockMap: Record<string, T[]>): T[] => {
        if (supabaseData && supabaseData.length > 0) return supabaseData;
        if (isPioneer) {
          return mockMap[sId] || mockMap['22222222-2222-2222-2222-222222222222'] || [];
        }
        return [];
      };

      if (supabase) {
        try {
          const [execRes, eventRes, projectRes, lecRes] = await Promise.all([
            supabase.from('executive_members').select('*').eq('session_id', sId).order('display_order', { ascending: true }),
            supabase.from('events').select('*').eq('session_id', sId).order('event_date', { ascending: false }),
            supabase.from('projects').select('*').eq('session_id', sId).order('display_order', { ascending: true }),
            supabase.from('lecturers').select('*').eq('session_id', sId).order('display_order', { ascending: true }),
          ]);

          setExecutives(withFallback(execRes.data, MOCK_EXECUTIVE_MEMBERS));
          setEvents(withFallback(eventRes.data, MOCK_EVENTS));
          setProjects(withFallback(projectRes.data, MOCK_PROJECTS));
          setLecturers(withFallback(lecRes.data, MOCK_LECTURERS));
          return;
        } catch (err) {
          console.error('Error fetching session details, utilizing fallback state', err);
        }
      }

      // Full offline fallback
      if (isPioneer) {
        setExecutives(MOCK_EXECUTIVE_MEMBERS[sId] || MOCK_EXECUTIVE_MEMBERS['22222222-2222-2222-2222-222222222222'] || []);
        setEvents(MOCK_EVENTS[sId] || MOCK_EVENTS['22222222-2222-2222-2222-222222222222'] || []);
        setProjects(MOCK_PROJECTS[sId] || MOCK_PROJECTS['22222222-2222-2222-2222-222222222222'] || []);
        setLecturers(MOCK_LECTURERS[sId] || MOCK_LECTURERS['22222222-2222-2222-2222-222222222222'] || []);
      } else {
        setExecutives([]);
        setEvents([]);
        setProjects([]);
        setLecturers([]);
      }
    }

    loadSessionScopedData();
  }, [selectedSession]);

  const presidentMember = executives.find((e) => e.office_position.toLowerCase().includes('president') && !e.office_position.toLowerCase().includes('vice'));

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDF8] text-[#1A1A1A] w-full max-w-full overflow-x-hidden">
      
      {/* Navbar with Session Toggle */}
      <Navbar
        sessions={sessions}
        selectedSession={selectedSession}
        onSelectSession={(s) => setSelectedSession(s)}
      />

      {/* Main Single-Page Scroll Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pt-16 sm:pt-20">
        
        {/* Section 1: President's Address */}
        <PresidentAddress
          session={selectedSession}
          president={presidentMember}
        />

        {/* Section 2: The Executive Cabinet */}
        <ExecutiveCabinet
          executives={executives}
          themeTitle={selectedSession.theme_title}
        />

        {/* Section 3: Our Events (with Lightbox Gallery) */}
        <OurEvents
          events={events}
          themeTitle={selectedSession.theme_title}
        />

        {/* Section 4: Our Projects (Case-Study Style Cards) */}
        <OurProjects
          projects={projects}
          themeTitle={selectedSession.theme_title}
        />

        {/* Section 5: Lecturers & Faculty */}
        <Lecturers
          lecturers={lecturers}
          themeTitle={selectedSession.theme_title}
        />

      </main>

      {/* Footer with Persistent Founder Credit */}
      <Footer founder={founder} />

    </div>
  );
}
