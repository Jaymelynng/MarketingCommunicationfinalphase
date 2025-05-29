/*
  # Core Schema for Marketing Content Management System

  1. New Tables
    - content_items: Stores marketing content items
    - content_assignments: Links content to gyms
    - content_tasks: Tracks task status for each content item
    - content_types: Defines available content types
    - content_assets: Stores media assets for content items
    
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    
  3. Changes
    - Add foreign key relationships
    - Add check constraints for data validation
*/

-- Content Types Table
CREATE TABLE IF NOT EXISTS content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to content_types"
  ON content_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Content Items Table
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_type text NOT NULL,
  description text,
  examples text[],
  manager_duties text[],
  support_duties text[],
  go_live_date date NOT NULL,
  task_due_date date NOT NULL,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_content_type CHECK (content_type = ANY (ARRAY['reel', 'photo', 'carousel'])),
  CONSTRAINT valid_dates CHECK (task_due_date <= go_live_date)
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to content_items"
  ON content_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Content Assignments Table
CREATE TABLE IF NOT EXISTS content_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  manager_notes text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to content_assignments"
  ON content_assignments
  FOR SELECT
  TO authenticated
  USING (true);

-- Content Tasks Table
CREATE TABLE IF NOT EXISTS content_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id),
  gym_id uuid REFERENCES gyms(id),
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to content_tasks"
  ON content_tasks
  FOR SELECT
  TO authenticated
  USING (true);

-- Content Assets Table
CREATE TABLE IF NOT EXISTS content_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  asset_type text NOT NULL,
  url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to content_assets"
  ON content_assets
  FOR SELECT
  TO authenticated
  USING (true);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_assignments_updated_at
  BEFORE UPDATE ON content_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_tasks_updated_at
  BEFORE UPDATE ON content_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();