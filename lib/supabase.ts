import { createClient } from '@supabase/supabase-js';
import { AcademicSession, ExecutiveMember, EventItem, ProjectItem, Lecturer, Founder, FullSessionData } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Fallback / Seed Data for smooth client preview when Supabase is not connected
export const MOCK_FOUNDER: Founder = {
  id: '11111111-1111-1111-1111-111111111111',
  full_name: 'Abdulwarees',
  photo_url: '/assets/logo.jpg',
  title: 'Pioneer President, The Elevation Era',
  message: `Welcome, AHEFFSITES!\nOn behalf of the founding team of The Elevation Era, I am thrilled to welcome you to the official digital portal of the Association of Home Economics and Food Science Students (AHEFSS).\n\nWhen this administration took office, our core mission was encapsulated in our name: to elevate the standard of our department across all fronts. Achieving this was no small task, but by God's grace and through the unwavering support of our Head of Department, our Staff Adviser, our esteemed lecturers, a dedicated executive council, and the entire AHEFSSITE body, we were able to push boundaries and do better.\n\nThe creation of this website stems from a critical challenge we identified: a persistent gap in information regarding the association's work. For too long, many students were unaware of the association's active presence, let alone the impactful programs and events being organized for their growth.\n\nWe built this platform to change that narrative permanently. This platform serves three vital purposes:\n1. A Living Showcase: To bring visibility to every event, workshop, and project carried out for the benefit of our students.\n2. A Permanent Legacy Archive: To ensure that the history, hard work, and milestones of our association are preserved for years to come—far beyond traditional paper handover forms.\n3. A Blueprint for Future Leadership: To provide incoming administrations with a clear view of what has been accomplished, setting a benchmark that inspires higher participation and even greater achievements in every new academic session.\n\nThis portal represents the bedrock of our legacy. As you explore the achievements of The Elevation Era, I hope it fills you with pride in our department and inspires you to actively engage with the association moving forward.\n\nWelcome aboard, and keep elevating!`
};

export const MOCK_SESSIONS: AcademicSession[] = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    session_code: '2025/2026',
    theme_title: 'Pioneer Era',
    is_pioneer: true,
    is_active: true,
    created_at: new Date().toISOString(),
  }
];

export const MOCK_EXECUTIVE_MEMBERS: Record<string, ExecutiveMember[]> = {
  '22222222-2222-2222-2222-222222222222': [
    {
      id: 'exec-1',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Abdulwarees',
      office_position: 'President',
      display_order: 1,
      photo_url: '/assets/logo.jpg',
      bio_quote: 'Leading the elevation of our standard across all academic and professional fronts.',
      whatsapp_url: 'https://wa.me/2348000000001',
    },
    {
      id: 'exec-2',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Vice President',
      office_position: 'Vice President',
      display_order: 2,
      photo_url: '/assets/logo.jpg',
      bio_quote: 'Fostering academic excellence and student welfare.',
      whatsapp_url: 'https://wa.me/2348000000002',
    },
    {
      id: 'exec-3',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'General Secretary',
      office_position: 'General Secretary',
      display_order: 3,
      photo_url: '/assets/logo.jpg',
      bio_quote: 'Ensuring seamless documentation and transparent governance.',
      whatsapp_url: 'https://wa.me/2348000000003',
    },
    {
      id: 'exec-4',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Financial Secretary',
      office_position: 'Financial Secretary',
      display_order: 4,
      photo_url: '/assets/logo.jpg',
      bio_quote: 'Managing financial integrity and prudent resource allocation.',
      whatsapp_url: 'https://wa.me/2348000000004',
    },
    {
      id: 'exec-5',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Treasurer',
      office_position: 'Treasurer',
      display_order: 5,
      photo_url: '/assets/logo.jpg',
      bio_quote: 'Safeguarding financial assets and accounting standards.',
      whatsapp_url: 'https://wa.me/2348000000005',
    },
    {
      id: 'exec-6',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Public Relations Officer',
      office_position: 'Public Relations Officer',
      display_order: 6,
      photo_url: '/assets/logo.jpg',
      bio_quote: 'Amplifying student voices and broadcasting association achievements.',
      whatsapp_url: 'https://wa.me/2348000000006',
    },
    {
      id: 'exec-7',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Social Director',
      office_position: 'Social Director',
      display_order: 7,
      photo_url: '/assets/logo.jpg',
      bio_quote: 'Curating vibrant, unforgettable student experiences.',
      whatsapp_url: 'https://wa.me/2348000000007',
    },
    {
      id: 'exec-8',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Sports Director',
      office_position: 'Sports Director',
      display_order: 8,
      photo_url: '/assets/logo.jpg',
      bio_quote: 'Promoting physical wellness, teamwork, and athletic competitions.',
      whatsapp_url: 'https://wa.me/2348000000008',
    },
  ]
};

export const MOCK_EVENTS: Record<string, EventItem[]> = {
  '22222222-2222-2222-2222-222222222222': [
    {
      id: 'event-1',
      session_id: '22222222-2222-2222-2222-222222222222',
      title: 'Official AHEFSS Merchandise Creation & Exhibition',
      event_type: 'Merchandise Launch',
      event_date: '2026-03-15',
      flyer_banner_url: '/assets/merchandise/polo.png',
      summary_text: 'The Elevation Era officially unveiled its customized departmental apparel line, including branded polo shirts, caps, water bottles, pens, and ceramic mugs.',
      photo_gallery: [
        '/assets/merchandise/polo.png',
        '/assets/merchandise/polo black.png',
        '/assets/merchandise/cap black.png',
        '/assets/merchandise/cap white.png',
        '/assets/merchandise/bottle.png',
        '/assets/merchandise/bottle 2.png',
        '/assets/merchandise/mug.png',
        '/assets/merchandise/pen.png',
        '/assets/merchandise/shirt white.png',
        '/assets/merchandise/shirt black.png',
        '/assets/merchandise/IMG-20260314-WA0034.jpg',
        '/assets/merchandise/IMG-20260401-WA0035.jpg',
        '/assets/merchandise/IMG_20260522_135530_693.jpg',
        '/assets/merchandise/IMG_20260522_135627_139.jpg',
      ],
      attendees_count: 250,
    },
    {
      id: 'event-2',
      session_id: '22222222-2222-2222-2222-222222222222',
      title: 'Pioneer Inauguration & Elevation Symposium',
      event_type: 'Symposium',
      event_date: '2025-11-10',
      flyer_banner_url: '/assets/department_project.jpg',
      summary_text: 'The historic inauguration of the inaugural Elevation Era administration, bringing together departmental faculty, lecturers, and students.',
      photo_gallery: [
        '/assets/department_project.jpg',
        '/assets/logo.jpg',
      ],
      attendees_count: 400,
    }
  ]
};

export const MOCK_PROJECTS: Record<string, ProjectItem[]> = {
  '22222222-2222-2222-2222-222222222222': [
    {
      id: 'project-1',
      session_id: '22222222-2222-2222-2222-222222222222',
      title: 'Departmental Digital Archival Portal & Media Hub',
      cover_image_url: '/assets/department_project.jpg',
      summary_text: 'A landmark digital infrastructure project designed to permanently archive departmental history, executive achievements, event photo galleries, and lecturer directories across sessions.',
      photo_gallery: [
        '/assets/department_project.jpg',
        '/assets/logo.jpg'
      ],
      display_order: 1,
    }
  ]
};

export const MOCK_LECTURERS: Record<string, Lecturer[]> = {
  '22222222-2222-2222-2222-222222222222': [
    {
      id: 'lec-1',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Head of Department (HOD)',
      is_hod: true,
      photo_url: '/assets/logo.jpg',
      display_order: 1,
    },
    {
      id: 'lec-2',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Prof. O. A. Adebayo',
      is_hod: false,
      photo_url: null,
      display_order: 2,
    },
    {
      id: 'lec-3',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Dr. Mrs. C. F. Okonkwo',
      is_hod: false,
      photo_url: null,
      display_order: 3,
    },
    {
      id: 'lec-4',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Dr. K. E. Ibrahim',
      is_hod: false,
      photo_url: null,
      display_order: 4,
    },
    {
      id: 'lec-5',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Engr. T. O. Alabi',
      is_hod: false,
      photo_url: null,
      display_order: 5,
    },
    {
      id: 'lec-6',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Mrs. A. M. Bello',
      is_hod: false,
      photo_url: null,
      display_order: 6,
    },
    {
      id: 'lec-7',
      session_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Mr. S. B. Oladipo',
      is_hod: false,
      photo_url: null,
      display_order: 7,
    },
  ]
};
