/*
  # Marketing Hub Schema

  1. New Tables
    - `marketing_tasks` - Tasks associated with content
    - `gym_details` - Gym information and social links
    - `content_types` - Types of content with metadata

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create marketing_tasks table
CREATE TABLE IF NOT EXISTS marketing_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES marketing_content(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  due_date timestamptz,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gym_details table
CREATE TABLE IF NOT EXISTS gym_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_name text NOT NULL,
  location text,
  instagram_url text,
  facebook_url text,
  sharepoint_url text,
  created_at timestamptz DEFAULT now()
);

-- Create content_types table
CREATE TABLE IF NOT EXISTS content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE marketing_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow authenticated read access to marketing_tasks"
  ON marketing_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to gym_details"
  ON gym_details FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to content_types"
  ON content_types FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial content types
INSERT INTO content_types (name, icon, description) VALUES
  ('social_media', 'message-square', 'Social media posts and stories'),
  ('email', 'mail', 'Email campaigns and newsletters'),
  ('in_gym', 'image', 'Physical marketing materials for gym display');

-- Insert sample gym details
INSERT INTO gym_details (gym_name, location) VALUES
  ('Capital Gymnastics Cedar Park', 'Cedar Park, TX'),
  ('Capital Gymnastics Round Rock', 'Round Rock, TX'),
  ('Houston Gymnastics Academy', 'Houston, TX'),
  ('Scottsdale Gymnastics', 'Scottsdale, AZ');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_marketing_tasks_updated_at
  BEFORE UPDATE ON marketing_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();