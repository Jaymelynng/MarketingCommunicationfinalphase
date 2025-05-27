/*
  # Fix duplicate policies and add gym details

  1. New Tables
    - `marketing_tasks`: Tracks marketing-related tasks
    - `gym_details`: Stores gym information and social media links
    - `content_types`: Defines different types of marketing content

  2. Security
    - Enable RLS on all new tables
    - Add read access policies for authenticated users
    
  3. Initial Data
    - Insert content types
    - Insert sample gym details
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

-- Add RLS policies with unique names
CREATE POLICY "marketing_tasks_read_policy"
  ON marketing_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "gym_details_read_policy"
  ON gym_details FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "content_types_read_policy"
  ON content_types FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial content types
INSERT INTO content_types (name, icon, description) VALUES
  ('social_media', 'message-square', 'Social media posts and stories'),
  ('email', 'mail', 'Email campaigns and newsletters'),
  ('in_gym', 'image', 'Physical marketing materials for gym display');

-- Insert sample gym details with social media links
INSERT INTO gym_details (gym_name, location, instagram_url, facebook_url, sharepoint_url) VALUES
  ('Capital Gymnastics Cedar Park', 'Cedar Park, TX', 'https://instagram.com/capitalgymcedarpark', 'https://facebook.com/capitalgymcedarpark', 'https://sharepoint.com/capitalgymcedarpark'),
  ('Capital Gymnastics Round Rock', 'Round Rock, TX', 'https://instagram.com/capitalgymroundrock', 'https://facebook.com/capitalgymroundrock', 'https://sharepoint.com/capitalgymroundrock'),
  ('Houston Gymnastics Academy', 'Houston, TX', 'https://instagram.com/houstongymnastics', 'https://facebook.com/houstongymnastics', 'https://sharepoint.com/houstongymnastics'),
  ('Scottsdale Gymnastics', 'Scottsdale, AZ', 'https://instagram.com/scottsdalegymnastics', 'https://facebook.com/scottsdalegymnastics', 'https://sharepoint.com/scottsdalegymnastics');

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