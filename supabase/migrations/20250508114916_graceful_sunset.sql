/*
  # Content Management Structure

  1. New Tables
    - `content_types` - Types of content with required name and icon
    - `content_details` - Additional content metadata and specifications
    - `content_tasks` - Task tracking for content items
    - `content_assets` - Associated assets and files

  2. Changes
    - Add new columns to marketing_content for better content organization
    - Add RLS policies for authenticated access
    - Add triggers for updated_at timestamps
*/

-- Create content_types table
CREATE TABLE IF NOT EXISTS content_types (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  icon text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create content_details table
CREATE TABLE IF NOT EXISTS content_details (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content_id integer REFERENCES marketing_content(id) ON DELETE CASCADE,
  photo_examples text[],
  visual_notes text,
  key_points text[],
  dimensions text,
  print_specs jsonb,
  email_preview_link text,
  email_template_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_tasks table
CREATE TABLE IF NOT EXISTS content_tasks (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content_id integer REFERENCES marketing_content(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  assignee_id integer,
  due_date timestamptz,
  status text DEFAULT 'pending',
  completion_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_assets table
CREATE TABLE IF NOT EXISTS content_assets (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content_id integer REFERENCES marketing_content(id) ON DELETE CASCADE,
  asset_type text NOT NULL,
  url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to marketing_content
ALTER TABLE marketing_content 
  ADD COLUMN IF NOT EXISTS focus_area text,
  ADD COLUMN IF NOT EXISTS theme text,
  ADD COLUMN IF NOT EXISTS target_audience text,
  ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_by integer,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_notes text;

-- Enable RLS on new tables
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow authenticated read access to content_types"
  ON content_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to content_details"
  ON content_details FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to content_tasks"
  ON content_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to content_assets"
  ON content_assets FOR SELECT
  TO authenticated
  USING (true);

-- Add updated_at triggers
CREATE TRIGGER update_content_details_updated_at
  BEFORE UPDATE ON content_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_tasks_updated_at
  BEFORE UPDATE ON content_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert initial content types with icons
INSERT INTO content_types (name, icon, description) VALUES
  ('social_media', 'message-square', 'Social media posts and stories'),
  ('email', 'mail', 'Email campaigns and newsletters'),
  ('in_gym', 'image', 'Physical marketing materials for gym display');