/*
  # Initial Database Schema

  1. New Tables
    - `tasks` - Task management
    - `gyms` - Gym information
    - `marketing_content` - Marketing materials
    - `news_updates` - System updates and notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create gyms table
CREATE TABLE IF NOT EXISTS gyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  task_type text NOT NULL,
  due_date timestamptz NOT NULL,
  go_live_date timestamptz,
  status text DEFAULT 'pending',
  gym_id uuid REFERENCES gyms(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketing_content table
CREATE TABLE IF NOT EXISTS marketing_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type text NOT NULL,
  scheduled_date timestamptz,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news_updates table
CREATE TABLE IF NOT EXISTS news_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'info',
  priority integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_updates ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow authenticated read access to gyms"
  ON gyms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to marketing_content"
  ON marketing_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to news_updates"
  ON news_updates FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial gyms
INSERT INTO gyms (name) VALUES
  ('Capital Gymnastics Cedar Park'),
  ('Capital Gymnastics Pflugerville'),
  ('Capital Gymnastics Round Rock'),
  ('Estrella Gymnastics'),
  ('Houston Gymnastics Academy'),
  ('Oasis Gymnastics'),
  ('Rowland Ballard - Atascocita'),
  ('Rowland Ballard - Kingwood'),
  ('Scottsdale Gymnastics'),
  ('Tigar Gymnastics');

-- Insert sample news updates
INSERT INTO news_updates (title, content, category, priority, published_at)
VALUES 
  ('Welcome to Our New Platform', 'We are excited to announce the launch of our new content management platform.', 'info', 1, now()),
  ('System Maintenance Notice', 'Scheduled maintenance will occur this weekend. Please save your work.', 'alert', 2, now()),
  ('New Feature: Task Management', 'We have added new task management capabilities to help streamline your workflow.', 'update', 1, now());