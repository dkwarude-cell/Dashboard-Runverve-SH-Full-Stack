-- SmartHeal Dashboard - Seed Data
-- Run this AFTER schema.sql in your Supabase SQL Editor

-- ============================================
-- SEED CLIENTS
-- ============================================
INSERT INTO public.clients (id, name, email, phone, avatar_color, progress, sessions, adherence, last_active, change, status, profile_type, notes) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Priya Sharma', 'priya.sharma@email.com', '+91-98765-43210', '#e84d6a', 78, 24, 92, '2 hours ago', 5.2, 'Active', 'Orthopedic', 'Post-knee surgery recovery. Excellent compliance with therapy protocols.'),
  ('c1000000-0000-0000-0000-000000000002', 'Arjun Patel', 'arjun.patel@email.com', '+91-87654-32109', '#3b82f6', 65, 18, 85, '1 day ago', 3.8, 'Active', 'Neurological', 'Stroke rehabilitation. Showing steady improvement in motor functions.'),
  ('c1000000-0000-0000-0000-000000000003', 'Ananya Iyer', 'ananya.iyer@email.com', '+91-76543-21098', '#10b981', 92, 36, 98, '30 min ago', 8.1, 'Active', 'Sports Medicine', 'ACL reconstruction recovery. Athlete - ahead of recovery timeline.'),
  ('c1000000-0000-0000-0000-000000000004', 'Vikram Reddy', 'vikram.reddy@email.com', '+91-65432-10987', '#f59e0b', 45, 12, 70, '3 days ago', -2.1, 'Active', 'Cardiac', 'Cardiac rehabilitation program. Needs motivation for consistent sessions.'),
  ('c1000000-0000-0000-0000-000000000005', 'Meera Nair', 'meera.nair@email.com', '+91-54321-09876', '#8b5cf6', 88, 30, 95, '1 hour ago', 6.5, 'Active', 'Orthopedic', 'Hip replacement recovery. Excellent progress, transitioning to maintenance.'),
  ('c1000000-0000-0000-0000-000000000006', 'Rohan Gupta', 'rohan.gupta@email.com', '+91-43210-98765', '#06b6d4', 55, 15, 78, '5 days ago', 1.2, 'Active', 'Neurological', 'Parkinsons management. Focus on balance and mobility exercises.'),
  ('c1000000-0000-0000-0000-000000000007', 'Kavya Menon', 'kavya.menon@email.com', '+91-32109-87654', '#e84d6a', 35, 8, 60, '1 week ago', -4.3, 'Inactive', 'General', 'General wellness program. Has not attended recent scheduled sessions.'),
  ('c1000000-0000-0000-0000-000000000008', 'Aditya Joshi', 'aditya.joshi@email.com', '+91-21098-76543', '#3b82f6', 72, 22, 88, '4 hours ago', 4.7, 'Active', 'Sports Medicine', 'Tennis elbow treatment. Responding well to ultrasound therapy.'),
  ('c1000000-0000-0000-0000-000000000009', 'Deepika Singh', 'deepika.singh@email.com', '+91-10987-65432', '#10b981', 82, 28, 91, '6 hours ago', 5.9, 'Active', 'Cardiac', 'Post-bypass cardiac rehab. Strong improvement in cardiovascular fitness.'),
  ('c1000000-0000-0000-0000-000000000010', 'Rajesh Kumar', 'rajesh.kumar@email.com', '+91-99887-76655', '#f59e0b', 60, 16, 75, '2 days ago', 2.3, 'Active', 'Orthopedic', 'Rotator cuff repair recovery. Moderate progress, needs more consistency.'),
  ('c1000000-0000-0000-0000-000000000011', 'Sneha Desai', 'sneha.desai@email.com', '+91-88776-65544', '#8b5cf6', 20, 4, 40, '2 weeks ago', -8.5, 'Inactive', 'General', 'Initial assessment complete. Failed to follow up on treatment plan.'),
  ('c1000000-0000-0000-0000-000000000012', 'Karthik Rao', 'karthik.rao@email.com', '+91-77665-54433', '#06b6d4', 95, 40, 99, '15 min ago', 9.2, 'Active', 'Sports Medicine', 'Final phase of ACL recovery. Ready for return-to-sport testing.');

-- ============================================
-- SEED DEVICES
-- ============================================
INSERT INTO public.devices (id, name, type, status, battery, signal, firmware, client_id, intensity_level, pulse_frequency, treatment_duration, pulse_width, temperature) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'SmartHeal Pro X1', 'Ultrasound Therapy', 'Connected', 85, 'Strong', '2.4.1', 'c1000000-0000-0000-0000-000000000001', 65, 40, 30, 55, 38),
  ('d1000000-0000-0000-0000-000000000002', 'SmartHeal Neuro N2', 'Neurostimulation', 'Connected', 72, 'Strong', '2.3.8', 'c1000000-0000-0000-0000-000000000002', 45, 60, 25, 40, 37),
  ('d1000000-0000-0000-0000-000000000003', 'SmartHeal Sport S3', 'EMS Therapy', 'Standby', 91, 'Moderate', '2.4.0', 'c1000000-0000-0000-0000-000000000003', 70, 55, 45, 60, 39),
  ('d1000000-0000-0000-0000-000000000004', 'SmartHeal Cardio C1', 'Cardiac Monitor', 'Connected', 65, 'Strong', '2.2.5', 'c1000000-0000-0000-0000-000000000004', 30, 35, 60, 45, 37),
  ('d1000000-0000-0000-0000-000000000005', 'SmartHeal Pro X2', 'Ultrasound Therapy', 'Offline', 15, 'Weak', '2.1.0', NULL, 50, 50, 30, 50, 37),
  ('d1000000-0000-0000-0000-000000000006', 'SmartHeal Flex F1', 'TENS Unit', 'Connected', 88, 'Strong', '2.4.1', 'c1000000-0000-0000-0000-000000000005', 55, 70, 35, 50, 38);

-- ============================================
-- SEED SESSIONS (last 6 months of data)
-- ============================================
INSERT INTO public.sessions (client_id, therapist_id, therapy_type, date, time, duration, status, progress, notes) VALUES
  -- Use a placeholder therapist_id; in production this would reference actual profiles
  ('c1000000-0000-0000-0000-000000000001', 'demo-user-001', 'Ultrasound Therapy', '2026-03-12', '10:00 AM', '45 min', 'Scheduled', 0, 'Regular session - knee rehabilitation'),
  ('c1000000-0000-0000-0000-000000000002', 'demo-user-001', 'Neurostimulation', '2026-03-12', '11:30 AM', '30 min', 'Scheduled', 0, 'Motor function assessment'),
  ('c1000000-0000-0000-0000-000000000003', 'demo-user-001', 'EMS Therapy', '2026-03-12', '02:00 PM', '60 min', 'Scheduled', 0, 'ACL recovery - advanced phase'),
  ('c1000000-0000-0000-0000-000000000004', 'demo-user-001', 'Cardiac Rehab', '2026-03-12', '03:30 PM', '45 min', 'Scheduled', 0, 'Cardiovascular endurance training'),
  ('c1000000-0000-0000-0000-000000000001', 'demo-user-001', 'Ultrasound Therapy', '2026-03-11', '10:00 AM', '45 min', 'Completed', 85, 'Good progress on range of motion'),
  ('c1000000-0000-0000-0000-000000000003', 'demo-user-001', 'EMS Therapy', '2026-03-11', '02:00 PM', '60 min', 'Completed', 92, 'Excellent muscle activation'),
  ('c1000000-0000-0000-0000-000000000005', 'demo-user-001', 'TENS Therapy', '2026-03-10', '09:00 AM', '30 min', 'Completed', 88, 'Pain management session - hip'),
  ('c1000000-0000-0000-0000-000000000008', 'demo-user-001', 'Ultrasound Therapy', '2026-03-10', '11:00 AM', '30 min', 'Completed', 76, 'Tennis elbow - moderate improvement'),
  ('c1000000-0000-0000-0000-000000000009', 'demo-user-001', 'Cardiac Rehab', '2026-03-10', '02:30 PM', '45 min', 'Completed', 90, 'Cardiovascular fitness improving steadily'),
  ('c1000000-0000-0000-0000-000000000002', 'demo-user-001', 'Neurostimulation', '2026-03-09', '10:00 AM', '30 min', 'Completed', 70, 'Balance exercises - good engagement'),
  ('c1000000-0000-0000-0000-000000000004', 'demo-user-001', 'Cardiac Rehab', '2026-03-09', '03:00 PM', '45 min', 'Cancelled', 0, 'Client cancelled due to schedule conflict'),
  ('c1000000-0000-0000-0000-000000000006', 'demo-user-001', 'Neurostimulation', '2026-03-08', '09:30 AM', '30 min', 'Completed', 65, 'Tremor management - slight improvement'),
  ('c1000000-0000-0000-0000-000000000010', 'demo-user-001', 'Ultrasound Therapy', '2026-03-08', '01:00 PM', '45 min', 'Completed', 72, 'Shoulder mobility increasing'),
  ('c1000000-0000-0000-0000-000000000012', 'demo-user-001', 'EMS Therapy', '2026-03-07', '10:00 AM', '60 min', 'Completed', 95, 'Return-to-sport protocol - excellent'),
  ('c1000000-0000-0000-0000-000000000001', 'demo-user-001', 'Ultrasound Therapy', '2026-03-06', '10:00 AM', '45 min', 'Completed', 80, 'Continued knee rehab'),
  ('c1000000-0000-0000-0000-000000000003', 'demo-user-001', 'EMS Therapy', '2026-03-05', '02:00 PM', '60 min', 'Completed', 88, 'Muscle strengthening phase'),
  ('c1000000-0000-0000-0000-000000000007', 'demo-user-001', 'General Wellness', '2026-03-04', '11:00 AM', '30 min', 'Cancelled', 0, 'Client no-show'),
  ('c1000000-0000-0000-0000-000000000005', 'demo-user-001', 'TENS Therapy', '2026-03-03', '09:00 AM', '30 min', 'Completed', 85, 'Pain levels decreasing consistently'),
  ('c1000000-0000-0000-0000-000000000009', 'demo-user-001', 'Cardiac Rehab', '2026-02-28', '02:30 PM', '45 min', 'Completed', 82, 'Heart rate response improving'),
  ('c1000000-0000-0000-0000-000000000002', 'demo-user-001', 'Neurostimulation', '2026-02-25', '10:00 AM', '30 min', 'Completed', 68, 'Fine motor skills training'),
  ('c1000000-0000-0000-0000-000000000008', 'demo-user-001', 'Ultrasound Therapy', '2026-02-20', '11:00 AM', '30 min', 'Completed', 70, 'Initial improvement in elbow'),
  ('c1000000-0000-0000-0000-000000000012', 'demo-user-001', 'EMS Therapy', '2026-02-15', '10:00 AM', '60 min', 'Completed', 90, 'Strength building on track'),
  ('c1000000-0000-0000-0000-000000000004', 'demo-user-001', 'Cardiac Rehab', '2026-02-10', '03:00 PM', '45 min', 'Completed', 55, 'Needs encouragement - low energy'),
  ('c1000000-0000-0000-0000-000000000001', 'demo-user-001', 'Ultrasound Therapy', '2026-01-20', '10:00 AM', '45 min', 'Completed', 60, 'Early phase recovery'),
  ('c1000000-0000-0000-0000-000000000003', 'demo-user-001', 'EMS Therapy', '2026-01-15', '02:00 PM', '60 min', 'Completed', 75, 'ACL mid-phase recovery');

-- ============================================
-- SEED QUERIES (Support Tickets)
-- ============================================
INSERT INTO public.queries (id, title, description, client_id, priority, status, support_id, device_info) VALUES
  ('q1000000-0000-0000-0000-000000000001', 'Device connectivity issues', 'SmartHeal Pro X2 is not connecting to the app. Tried resetting Bluetooth and restarting the device.', 'c1000000-0000-0000-0000-000000000005', 'High', 'Open', 'SUP-1001', 'SmartHeal Pro X2 - FW 2.1.0'),
  ('q1000000-0000-0000-0000-000000000002', 'Billing inquiry - insurance coverage', 'Client is asking about insurance coverage for extended therapy sessions beyond the initial 12-session plan.', 'c1000000-0000-0000-0000-000000000004', 'Medium', 'In Progress', 'SUP-1002', NULL),
  ('q1000000-0000-0000-0000-000000000003', 'Therapy protocol adjustment request', 'Requesting increase in ultrasound intensity level for knee therapy. Current settings feel too low.', 'c1000000-0000-0000-0000-000000000001', 'Low', 'New', 'SUP-1003', 'SmartHeal Pro X1 - FW 2.4.1'),
  ('q1000000-0000-0000-0000-000000000004', 'Device firmware update failed', 'Attempted OTA firmware update on Neuro N2 but it failed midway. Device is stuck on boot screen.', 'c1000000-0000-0000-0000-000000000002', 'Critical', 'Open', 'SUP-1004', 'SmartHeal Neuro N2 - FW 2.3.8'),
  ('q1000000-0000-0000-0000-000000000005', 'Session rescheduling request', 'Client needs to reschedule all sessions for next week due to travel. Prefers morning slots.', 'c1000000-0000-0000-0000-000000000009', 'Low', 'Closed', 'SUP-1005', NULL),
  ('q1000000-0000-0000-0000-000000000006', 'Pain during EMS session', 'Client reported discomfort during last EMS therapy at intensity level 70. Need to review safety protocols.', 'c1000000-0000-0000-0000-000000000003', 'High', 'In Progress', 'SUP-1006', 'SmartHeal Sport S3 - FW 2.4.0');

-- ============================================
-- SEED QUERY RESPONSES
-- ============================================
INSERT INTO public.query_responses (query_id, author, message, is_staff) VALUES
  ('q1000000-0000-0000-0000-000000000001', 'Tech Support', 'We have identified this as a known issue with firmware 2.1.0. A patch is being prepared. In the meantime, try a factory reset.', true),
  ('q1000000-0000-0000-0000-000000000001', 'Meera Nair', 'I tried the factory reset but the device still wont connect. The LED keeps blinking red.', false),
  ('q1000000-0000-0000-0000-000000000002', 'Billing Team', 'We have contacted the insurance provider. Most plans cover up to 20 sessions. Will update once we hear back.', true),
  ('q1000000-0000-0000-0000-000000000004', 'Tech Support', 'This is a critical issue. Please do NOT attempt to restart the device. Our field technician will visit within 24 hours.', true),
  ('q1000000-0000-0000-0000-000000000006', 'Dr. SmartHeal Admin', 'Reviewed the session log. Intensity was set at 70% which is within safe limits, but this client has sensitive nerve responses. Recommend reducing to 55%.', true),
  ('q1000000-0000-0000-0000-000000000006', 'Ananya Iyer', 'Thank you for looking into this. The lower setting sounds good. Can we try it at the next session?', false);

-- ============================================
-- SEED ANALYTICS EVENTS
-- ============================================
INSERT INTO public.analytics_events (event_type, metadata, created_at) VALUES
  ('login', '{"method": "google"}', NOW() - INTERVAL '1 day'),
  ('login', '{"method": "google"}', NOW() - INTERVAL '2 days'),
  ('login', '{"method": "github"}', NOW() - INTERVAL '3 days'),
  ('signup', '{"method": "google"}', NOW() - INTERVAL '5 days'),
  ('login', '{"method": "demo"}', NOW() - INTERVAL '7 days'),
  ('login', '{"method": "google"}', NOW() - INTERVAL '10 days'),
  ('signup', '{"method": "github"}', NOW() - INTERVAL '15 days'),
  ('login', '{"method": "google"}', NOW() - INTERVAL '20 days'),
  ('login', '{"method": "google"}', NOW() - INTERVAL '30 days'),
  ('signup', '{"method": "google"}', NOW() - INTERVAL '35 days'),
  ('login', '{"method": "demo"}', NOW() - INTERVAL '40 days'),
  ('login', '{"method": "google"}', NOW() - INTERVAL '50 days'),
  ('signup', '{"method": "google"}', NOW() - INTERVAL '60 days'),
  ('login', '{"method": "github"}', NOW() - INTERVAL '70 days'),
  ('login', '{"method": "google"}', NOW() - INTERVAL '80 days'),
  ('signup', '{"method": "google"}', NOW() - INTERVAL '90 days'),
  ('login', '{"method": "google"}', NOW() - INTERVAL '100 days'),
  ('login', '{"method": "demo"}', NOW() - INTERVAL '110 days'),
  ('signup', '{"method": "github"}', NOW() - INTERVAL '120 days'),
  ('login', '{"method": "google"}', NOW() - INTERVAL '130 days');
