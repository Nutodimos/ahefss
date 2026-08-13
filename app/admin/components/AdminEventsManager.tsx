'use client';

import React, { useState } from 'react';
import { AcademicSession, EventItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';
import { Lock, Plus, Trash2, ShieldAlert } from 'lucide-react';

interface AdminEventsManagerProps {
  session: AcademicSession;
  events: EventItem[];
  onRefresh: () => void;
}

export default function AdminEventsManager({
  session,
  events,
  onRefresh,
}: AdminEventsManagerProps) {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Workshop');
  const [eventDate, setEventDate] = useState('2026-06-01');
  const [flyerUrl, setFlyerUrl] = useState('/assets/department_project.jpg');
  const [summaryText, setSummaryText] = useState('');
  const [galleryUrls, setGalleryUrls] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(150);
  const [loading, setLoading] = useState(false);

  const isLocked = session.is_pioneer;

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);

    const photos = galleryUrls
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newEvent = {
      id: crypto.randomUUID(),
      session_id: session.id,
      title: title.trim(),
      event_type: eventType.trim(),
      event_date: eventDate,
      flyer_banner_url: flyerUrl.trim(),
      summary_text: summaryText.trim(),
      photo_gallery: photos,
      attendees_count: Number(attendeesCount),
    };

    if (supabase) {
      await supabase.from('events').insert([newEvent]);
    }

    setTitle('');
    setSummaryText('');
    setGalleryUrls('');
    setLoading(false);
    onRefresh();
  }

  async function handleDeleteEvent(id: string) {
    if (isLocked) return;
    if (supabase) {
      await supabase.from('events').delete().eq('id', id);
    }
    onRefresh();
  }

  return (
    <div className="space-y-6">
      
      {isLocked && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Pioneer Session Read-Only Lock:</span> Events recorded in the founding administration are permanently archived and protected against modification.
          </div>
        </div>
      )}

      {/* Add New Event Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#1A4D2E] uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#C9A227]" />
          <span>Add New Event ({session.session_code})</span>
        </h3>

        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              required
              disabled={isLocked}
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />

            <input
              type="text"
              required
              disabled={isLocked}
              placeholder="Event Type (e.g. Symposium, Exhibition)"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />

            <input
              type="date"
              required
              disabled={isLocked}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direct Cloudinary Upload Component for Flyer Banner */}
            <CloudinaryUploadWidget
              label="Flyer Banner Image"
              value={flyerUrl}
              onChange={(url) => setFlyerUrl(url)}
            />

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Attendees Count
              </label>
              <input
                type="number"
                disabled={isLocked}
                placeholder="Attendees Count"
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
              />
            </div>
          </div>

          <textarea
            required
            disabled={isLocked}
            rows={3}
            placeholder="Event Recap & Summary Text"
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs disabled:bg-gray-100 disabled:opacity-60"
          />

          {/* Direct Cloudinary Upload Component for Gallery Photos */}
          <CloudinaryUploadWidget
            label="Event Photo Gallery Images (Multiple)"
            value={galleryUrls}
            multiple={true}
            onChange={(url) => setGalleryUrls(url)}
            onMultipleChange={(urls) => {
              const current = galleryUrls ? galleryUrls.split(',').map((s) => s.trim()) : [];
              setGalleryUrls([...current, ...urls].join(', '));
            }}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLocked || loading}
              className="px-5 py-2.5 rounded-xl bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              {isLocked ? 'Locked (Pioneer Session)' : 'Save Event & Gallery'}
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Recorded Events ({events.length})
        </h4>

        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-4 bg-[#FDFDF8]">
              <div className="flex items-center gap-3">
                <img
                  src={getOptimizedImageUrl(ev.flyer_banner_url, { type: 'banner', width: 200 })}
                  alt={ev.title}
                  className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                />
                <div>
                  <div className="text-sm font-bold text-gray-900">{ev.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span className="text-[#1A4D2E] font-semibold">{ev.event_type}</span>
                    <span>•</span>
                    <span>{ev.event_date}</span>
                    <span>•</span>
                    <span>{ev.photo_gallery?.length || 0} Gallery Photos</span>
                  </div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
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
