-- SmartHeal Dashboard - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'therapist' CHECK (role IN ('admin', 'therapist', 'support')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  avatar_color TEXT NOT NULL DEFAULT '#3b82f6',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  sessions INTEGER NOT NULL DEFAULT 0,
  adherence INTEGER NOT NULL DEFAULT 0 CHECK (adherence >= 0 AND adherence <= 100),
  last_active TEXT NOT NULL DEFAULT 'Never',
  change REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  profile_type TEXT NOT NULL DEFAULT 'General',
  therapist_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clients" ON public.clients
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert clients" ON public.clients
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update clients" ON public.clients
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete clients" ON public.clients
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapy_type TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '30 min',
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Completed', 'Scheduled', 'Cancelled', 'In Progress')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view sessions" ON public.sessions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sessions" ON public.sessions
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sessions" ON public.sessions
  FOR UPDATE TO authenticated USING (true);

-- ============================================
-- QUERIES TABLE (Support Tickets)
-- ============================================
CREATE TABLE IF NOT EXISTS public.queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Open', 'In Progress', 'Closed')),
  support_id TEXT NOT NULL DEFAULT ('SUP-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
  device_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view queries" ON public.queries
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert queries" ON public.queries
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update queries" ON public.queries
  FOR UPDATE TO authenticated USING (true);

-- ============================================
-- QUERY RESPONSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.query_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_id UUID NOT NULL REFERENCES public.queries(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  message TEXT NOT NULL,
  is_staff BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.query_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view responses" ON public.query_responses
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert responses" ON public.query_responses
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- DEVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Therapy Device',
  status TEXT NOT NULL DEFAULT 'Offline' CHECK (status IN ('Connected', 'Standby', 'Offline')),
  battery INTEGER NOT NULL DEFAULT 100 CHECK (battery >= 0 AND battery <= 100),
  signal TEXT NOT NULL DEFAULT 'Strong',
  firmware TEXT NOT NULL DEFAULT '1.0.0',
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  intensity_level INTEGER NOT NULL DEFAULT 50,
  pulse_frequency INTEGER NOT NULL DEFAULT 50,
  treatment_duration INTEGER NOT NULL DEFAULT 50,
  pulse_width INTEGER NOT NULL DEFAULT 50,
  temperature INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view devices" ON public.devices
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update devices" ON public.devices
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can insert devices" ON public.devices
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- MESSAGES TABLE (Communication Hub)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT TO authenticated USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own received messages" ON public.messages
  FOR UPDATE TO authenticated USING (receiver_id = auth.uid());

-- ============================================
-- ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  metadata JSONB,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view events" ON public.analytics_events
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert events" ON public.analytics_events
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

-- Dashboard statistics
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  total_clients BIGINT,
  active_sessions BIGINT,
  completion_rate NUMERIC,
  total_devices BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.clients)::BIGINT AS total_clients,
    (SELECT COUNT(*) FROM public.sessions WHERE status IN ('Scheduled', 'In Progress'))::BIGINT AS active_sessions,
    COALESCE(
      (SELECT ROUND(
        COUNT(*) FILTER (WHERE status = 'Completed')::NUMERIC / NULLIF(COUNT(*)::NUMERIC, 0) * 100, 1
      ) FROM public.sessions),
      0
    ) AS completion_rate,
    (SELECT COUNT(*) FROM public.devices)::BIGINT AS total_devices;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Monthly session data for charts
CREATE OR REPLACE FUNCTION public.get_monthly_sessions(months_back INTEGER DEFAULT 7)
RETURNS TABLE (
  month TEXT,
  scheduled BIGINT,
  completed BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(d.month_start, 'Mon') AS month,
    COUNT(*) FILTER (WHERE s.status = 'Scheduled')::BIGINT AS scheduled,
    COUNT(*) FILTER (WHERE s.status = 'Completed')::BIGINT AS completed
  FROM generate_series(
    DATE_TRUNC('month', NOW()) - (months_back || ' months')::INTERVAL,
    DATE_TRUNC('month', NOW()),
    '1 month'::INTERVAL
  ) AS d(month_start)
  LEFT JOIN public.sessions s ON DATE_TRUNC('month', s.created_at) = d.month_start
  GROUP BY d.month_start
  ORDER BY d.month_start;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_queries_updated_at
  BEFORE UPDATE ON public.queries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================
-- Uncomment and run after creating a user account to seed sample data
/*
INSERT INTO public.clients (name, email, phone, avatar_color, progress, sessions, adherence, last_active, change, status, profile_type) VALUES
  ('Sarah Johnson', 'sarah.j@email.com', '+1 (555) 123-4567', '#3b82f6', 75, 24, 92, '2 hours ago', 12, 'Active', 'Physical Therapy'),
  ('Michael Chen', 'michael.c@email.com', '+1 (555) 234-5678', '#10b981', 85, 18, 78, '1 day ago', 8, 'Active', 'Rehabilitation'),
  ('Emily Davis', 'emily.d@email.com', '+1 (555) 345-6789', '#f59e0b', 45, 31, 95, '3 hours ago', -5, 'Active', 'Pain Management'),
  ('James Wilson', 'james.w@email.com', '+1 (555) 456-7890', '#8b5cf6', 60, 12, 65, '5 days ago', 3, 'Inactive', 'Neurological'),
  ('Lisa Anderson', 'lisa.a@email.com', '+1 (555) 567-8901', '#ef4444', 90, 36, 88, '1 hour ago', 15, 'Active', 'Orthopedic'),
  ('Robert Taylor', 'robert.t@email.com', '+1 (555) 678-9012', '#06b6d4', 30, 8, 72, '1 week ago', -2, 'Inactive', 'Sports Medicine');
*/
