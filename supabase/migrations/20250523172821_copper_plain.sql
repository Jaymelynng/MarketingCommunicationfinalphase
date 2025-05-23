/*
  # Initial Database Schema

  1. New Tables
    - `marketing_content` - Main content items
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `content_type` (text, required)
      - `scheduled_date` (timestamptz)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `marketing_tasks` - Tasks associated with content
      - `id` (uuid, primary key)
      - `content_id` (uuid, references marketing_content)
      - `task_type` (text, required)
      - `due_date` (timestamptz)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `gym_details` - Gym information
      - `id` (uuid, primary key)
      - `gym_name` (text, required)
      - `location` (text)
      - `instagram_url` (text)
      - `facebook_url` (text)
      - `sharepoint_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

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

-- Enable RLS
ALTER TABLE marketing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_details ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow authenticated read access to marketing_content"
  ON marketing_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to marketing_tasks"
  ON marketing_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to gym_details"
  ON gym_details FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_marketing_content_updated_at
  BEFORE UPDATE ON marketing_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_marketing_tasks_updated_at
  BEFORE UPDATE ON marketing_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert sample gyms
INSERT INTO gym_details (gym_name, location) VALUES
  ('Capital Gymnastics Cedar Park', 'Cedar Park, TX'),
  ('Capital Gymnastics Round Rock', 'Round Rock, TX'),
  ('Houston Gymnastics Academy', 'Houston, TX'),
  ('Scottsdale Gymnastics', 'Scottsdale, AZ');

-- Insert sample content
INSERT INTO marketing_content (title, description, content_type, scheduled_date) VALUES
  ('December Newsletter', 'Monthly newsletter highlighting winter programs', 'email', '2024-12-01'),
  ('Holiday Camp Promotion', 'Social media campaign for winter camp', 'social_media', '2024-12-05'),
  ('Winter Competition Flyer', 'In-gym flyer for upcoming competition', 'in_gym', '2024-12-10');

-- Add sample tasks
INSERT INTO marketing_tasks (content_id, task_type, due_date)
SELECT 
  id,
  'review',
  scheduled_date - interval '3 days'
FROM marketing_content;