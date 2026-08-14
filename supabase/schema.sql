-- Create tables
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT NOT NULL,
  theme_title TEXT NOT NULL,
  is_pioneer BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE executives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  office_position TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  photo_url TEXT,
  bio_quote TEXT,
  whatsapp_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  flyer_banner_url TEXT,
  summary_text TEXT,
  photo_gallery TEXT[],
  attendees_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  cover_image_url TEXT,
  summary_text TEXT,
  photo_gallery TEXT[],
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lecturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  is_hod BOOLEAN DEFAULT false,
  photo_url TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  photo_url TEXT,
  title TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Reads
CREATE POLICY "Allow public read access to sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to executives" ON executives FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to lecturers" ON lecturers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to founders" ON founders FOR SELECT USING (true);

-- Create Policies for Authenticated Inserts/Updates/Deletes
CREATE POLICY "Allow authenticated access to sessions" ON sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to executives" ON executives FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to lecturers" ON lecturers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to founders" ON founders FOR ALL USING (auth.role() = 'authenticated');

-- Create Pioneer Lock Trigger
CREATE OR REPLACE FUNCTION prevent_pioneer_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent updates/deletes to any session where is_pioneer = true
  IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
    IF OLD.is_pioneer = true THEN
      RAISE EXCEPTION 'Pioneer session data cannot be modified or deleted.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lock_pioneer_sessions
  BEFORE UPDATE OR DELETE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION prevent_pioneer_edit();
