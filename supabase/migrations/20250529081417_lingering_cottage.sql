/*
  # Fix News Updates Schema

  1. Changes
    - Add missing columns to news_updates table:
      - title (text, not null)
      - content (text)
      - date_posted (timestamptz, default now())
      - gym_id (uuid, references gyms)
    - Add RLS policies for news_updates table

  2. Security
    - Enable RLS on news_updates table
    - Add policies for:
      - Select: Authenticated users can read all news updates
      - Insert/Update: Only admins can modify news updates
*/

-- Add missing columns to news_updates table
ALTER TABLE news_updates 
  ADD COLUMN IF NOT EXISTS title text NOT NULL,
  ADD COLUMN IF NOT EXISTS content text,
  ADD COLUMN IF NOT EXISTS date_posted timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS gym_id uuid REFERENCES gyms(gym_id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE news_updates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read news updates"
  ON news_updates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert news updates"
  ON news_updates
  FOR INSERT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Only admins can update news updates"
  ON news_updates
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Add index for performance
CREATE INDEX IF NOT EXISTS news_updates_date_posted_idx ON news_updates(date_posted DESC);