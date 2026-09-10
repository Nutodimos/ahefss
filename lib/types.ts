export interface AcademicSession {
  id: string;
  session_code: string;
  theme_title: string;
  is_pioneer: boolean;
  is_active: boolean;
  is_archived?: boolean;
  created_at?: string;
}

export interface ExecutiveMember {
  id: string;
  session_id: string;
  full_name: string;
  office_position: string;
  display_order: number;
  photo_url: string;
  bio_quote?: string;
  whatsapp_url?: string;
  created_at?: string;
}

export interface EventItem {
  id: string;
  session_id: string;
  title: string;
  event_type: string;
  event_date: string;
  flyer_banner_url: string;
  summary_text: string;
  photo_gallery: string[];
  attendees_count: number;
  created_at?: string;
}

export interface ProjectItem {
  id: string;
  session_id: string;
  title: string;
  cover_image_url: string;
  summary_text: string;
  photo_gallery: string[];
  display_order: number;
  created_at?: string;
}

export interface Lecturer {
  id: string;
  session_id: string;
  full_name: string;
  is_hod: boolean;
  photo_url?: string | null;
  display_order: number;
  created_at?: string;
}

export interface Founder {
  id: string;
  full_name: string;
  photo_url: string;
  title?: string;
  message?: string;
  created_at?: string;
}

export interface FullSessionData {
  session: AcademicSession;
  executives: ExecutiveMember[];
  events: EventItem[];
  projects: ProjectItem[];
  lecturers: Lecturer[];
}
