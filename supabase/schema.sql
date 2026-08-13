-- Academic Sessions Table
CREATE TABLE IF NOT EXISTS academic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. '2025/2026'
  theme_title VARCHAR(255) NOT NULL,
  is_pioneer BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE, -- only ONE session TRUE at a time
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Executive Cabinet Members
CREATE TABLE IF NOT EXISTS executive_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES academic_sessions(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  office_position VARCHAR(150) NOT NULL,
  display_order INT DEFAULT 0,
  photo_url TEXT NOT NULL,
  bio_quote TEXT,
  whatsapp_url TEXT, -- e.g. https://wa.me/234...
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES academic_sessions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_date DATE NOT NULL,
  flyer_banner_url TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  photo_gallery TEXT[] DEFAULT '{}', -- unlimited; paginated client-side
  attendees_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects (distinct from events)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES academic_sessions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  cover_image_url TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  photo_gallery TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lecturers
CREATE TABLE IF NOT EXISTS lecturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES academic_sessions(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  is_hod BOOLEAN DEFAULT FALSE,
  photo_url TEXT, -- NULL for non-HOD
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founder (global singleton, NOT session-scoped)
CREATE TABLE IF NOT EXISTS founder (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  photo_url TEXT NOT NULL,
  title VARCHAR(150),
  message TEXT
);

-- Ensure single row for founder
CREATE UNIQUE INDEX IF NOT EXISTS single_founder_idx ON founder ((true));

--------------------------------------------------------------------------------
-- Trigger for automatic single active session switching
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_single_active_session()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = TRUE THEN
    UPDATE academic_sessions
    SET is_active = FALSE
    WHERE id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_single_active_session ON academic_sessions;
CREATE TRIGGER trigger_single_active_session
BEFORE INSERT OR UPDATE OF is_active ON academic_sessions
FOR EACH ROW
WHEN (NEW.is_active = TRUE)
EXECUTE FUNCTION set_single_active_session();

--------------------------------------------------------------------------------
-- Row Level Security (RLS) & Protection for Pioneer Data
--------------------------------------------------------------------------------
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access for all
CREATE POLICY "Public sessions read" ON academic_sessions FOR SELECT USING (true);
CREATE POLICY "Public execs read" ON executive_members FOR SELECT USING (true);
CREATE POLICY "Public events read" ON events FOR SELECT USING (true);
CREATE POLICY "Public projects read" ON projects FOR SELECT USING (true);
CREATE POLICY "Public lecturers read" ON lecturers FOR SELECT USING (true);
CREATE POLICY "Public founder read" ON founder FOR SELECT USING (true);

-- Helper function to check pioneer status
CREATE OR REPLACE FUNCTION is_pioneer_session(check_session_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  pioneer_status BOOLEAN;
BEGIN
  SELECT is_pioneer INTO pioneer_status FROM academic_sessions WHERE id = check_session_id;
  RETURN COALESCE(pioneer_status, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Write-Protection for Pioneer Session rows
CREATE POLICY "Prevent pioneer session modification" ON academic_sessions
  FOR UPDATE USING (is_pioneer = FALSE);

CREATE POLICY "Prevent pioneer session delete" ON academic_sessions
  FOR DELETE USING (is_pioneer = FALSE);

CREATE POLICY "Prevent pioneer exec modification" ON executive_members
  FOR ALL USING (NOT is_pioneer_session(session_id));

CREATE POLICY "Prevent pioneer events modification" ON events
  FOR ALL USING (NOT is_pioneer_session(session_id));

CREATE POLICY "Prevent pioneer projects modification" ON projects
  FOR ALL USING (NOT is_pioneer_session(session_id));

CREATE POLICY "Prevent pioneer lecturers modification" ON lecturers
  FOR ALL USING (NOT is_pioneer_session(session_id));

-- Admin full write access for non-pioneer sessions (authenticated users)
CREATE POLICY "Admin write sessions" ON academic_sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin write execs" ON executive_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin write events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin write projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin write lecturers" ON lecturers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin write founder" ON founder FOR ALL WITH CHECK (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- SEED DATA (Pioneer Era Baseline)
--------------------------------------------------------------------------------

-- Founder baseline
INSERT INTO founder (id, full_name, photo_url, title, message)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Abdulwarees',
  '/assets/logo.jpg',
  'Pioneer President, The Elevation Era',
  'Welcome, AHEFFSITES! On behalf of the founding team of The Elevation Era, I am thrilled to welcome you to the official digital portal of the Association of Home Economics and Food Science Students (AHEFSS). We built this platform to ensure our history, hard work, and milestones are preserved for years to come.'
)
ON CONFLICT (id) DO NOTHING;

-- Pioneer Session baseline
INSERT INTO academic_sessions (id, session_code, theme_title, is_pioneer, is_active)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '2025/2026',
  'Pioneer Era',
  TRUE,
  TRUE
)
ON CONFLICT (session_code) DO NOTHING;

-- Pioneer Executives
INSERT INTO executive_members (session_id, full_name, office_position, display_order, photo_url, bio_quote, whatsapp_url)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Abdulwarees', 'President', 1, '/assets/logo.jpg', 'Leading the elevation of our standard across all academic and professional fronts.', 'https://wa.me/2348000000001'),
  ('22222222-2222-2222-2222-222222222222', 'Vice President', 'Vice President', 2, '/assets/logo.jpg', 'Fostering academic excellence and student welfare.', 'https://wa.me/2348000000002'),
  ('22222222-2222-2222-2222-222222222222', 'General Secretary', 'General Secretary', 3, '/assets/logo.jpg', 'Ensuring seamless documentation and transparent governance.', 'https://wa.me/2348000000003'),
  ('22222222-2222-2222-2222-222222222222', 'Financial Secretary', 'Financial Secretary', 4, '/assets/logo.jpg', 'Managing financial integrity and prudent resource allocation.', 'https://wa.me/2348000000004'),
  ('22222222-2222-2222-2222-222222222222', 'Treasurer', 'Treasurer', 5, '/assets/logo.jpg', 'Safeguarding financial assets and accounting standards.', 'https://wa.me/2348000000005'),
  ('22222222-2222-2222-2222-222222222222', 'Public Relations Officer', 'Public Relations Officer', 6, '/assets/logo.jpg', 'Amplifying student voices and broadcasting association achievements.', 'https://wa.me/2348000000006'),
  ('22222222-2222-2222-2222-222222222222', 'Social Director', 'Social Director', 7, '/assets/logo.jpg', 'Curating vibrant, unforgettable student experiences.', 'https://wa.me/2348000000007'),
  ('22222222-2222-2222-2222-222222222222', 'Sports Director', 'Sports Director', 8, '/assets/logo.jpg', 'Promoting physical wellness, teamwork, and athletic competitions.', 'https://wa.me/2348000000008');

-- Pioneer Events (including Merchandise Creation & Launch Event with Cloudinary-ready gallery)
INSERT INTO events (session_id, title, event_type, event_date, flyer_banner_url, summary_text, photo_gallery, attendees_count)
VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    'Official AHEFSS Merchandise Creation & Exhibition',
    'Merchandise Launch',
    '2026-03-15',
    '/assets/merchandise/polo.png',
    'The Elevation Era officially unveiled its customized departmental apparel line, including branded polo shirts, caps, water bottles, pens, and ceramic mugs.',
    ARRAY[
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
      '/assets/merchandise/IMG_20260522_135627_139.jpg'
    ],
    250
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Pioneer Inauguration & Elevation Symposium',
    'Symposium',
    '2025-11-10',
    '/assets/department_project.jpg',
    'The historic inauguration of the inaugural Elevation Era administration, bringing together departmental faculty, lecturers, and students.',
    ARRAY[
      '/assets/department_project.jpg',
      '/assets/logo.jpg'
    ],
    400
  );

-- Pioneer Projects
INSERT INTO projects (session_id, title, cover_image_url, summary_text, photo_gallery, display_order)
VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    'Departmental Digital Archival Portal & Media Hub',
    '/assets/department_project.jpg',
    'A landmark digital infrastructure project designed to permanently archive departmental history, executive achievements, event photo galleries, and lecturer directories across sessions.',
    ARRAY[
      '/assets/department_project.jpg',
      '/assets/logo.jpg'
    ],
    1
  );

-- Pioneer Lecturers
INSERT INTO lecturers (session_id, full_name, is_hod, photo_url, display_order)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Head of Department (HOD)', TRUE, '/assets/logo.jpg', 1),
  ('22222222-2222-2222-2222-222222222222', 'Prof. O. A. Adebayo', FALSE, NULL, 2),
  ('22222222-2222-2222-2222-222222222222', 'Dr. Mrs. C. F. Okonkwo', FALSE, NULL, 3),
  ('22222222-2222-2222-2222-222222222222', 'Dr. K. E. Ibrahim', FALSE, NULL, 4),
  ('22222222-2222-2222-2222-222222222222', 'Engr. T. O. Alabi', FALSE, NULL, 5),
  ('22222222-2222-2222-2222-222222222222', 'Mrs. A. M. Bello', FALSE, NULL, 6),
  ('22222222-2222-2222-2222-222222222222', 'Mr. S. B. Oladipo', FALSE, NULL, 7);
