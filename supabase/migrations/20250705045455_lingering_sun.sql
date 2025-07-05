/*
# CommuterBuddy Initial Database Schema

1. New Tables
  - `profiles` - User profiles with emergency contacts and points
  - `routes` - User commute routes with GPS coordinates
  - `checkins` - Journey start/end tracking
  - `matches` - Commuter matching results
  - `buddy_requests` - Pending buddy invitations

2. Security
  - Enable RLS on all tables
  - Add policies for authenticated users to access their own data
  - Add policies for public data access where appropriate

3. Extensions
  - Enable PostGIS for geospatial queries
  - Enable UUID extension for primary keys
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  emergency_contact text,
  commuter_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  start_lat double precision NOT NULL,
  start_lon double precision NOT NULL,
  end_lat double precision NOT NULL,
  end_lon double precision NOT NULL,
  usual_time text NOT NULL,
  gpx_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create checkins table
CREATE TABLE IF NOT EXISTS checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('depart', 'arrive')) NOT NULL,
  lat double precision NOT NULL,
  lon double precision NOT NULL,
  timestamp timestamptz DEFAULT now(),
  route_id uuid REFERENCES routes(id) ON DELETE SET NULL
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  matched_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  route_similarity double precision DEFAULT 0,
  time_compatibility double precision DEFAULT 0,
  status text CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create buddy_requests table
CREATE TABLE IF NOT EXISTS buddy_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Routes policies
CREATE POLICY "Users can read own routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routes"
  ON routes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routes"
  ON routes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routes"
  ON routes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Checkins policies
CREATE POLICY "Users can read own checkins"
  ON checkins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins"
  ON checkins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can read their matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

CREATE POLICY "Users can insert matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Buddy requests policies
CREATE POLICY "Users can read their buddy requests"
  ON buddy_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert buddy requests"
  ON buddy_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received buddy requests"
  ON buddy_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

-- Create function to find nearby commuters
CREATE OR REPLACE FUNCTION find_matches(
  user_id uuid,
  buffer_meters integer DEFAULT 500,
  time_window_minutes integer DEFAULT 30
)
RETURNS TABLE (
  matched_user_id uuid,
  name text,
  route_similarity double precision,
  time_compatibility double precision,
  start_lat double precision,
  start_lon double precision,
  end_lat double precision,
  end_lon double precision
) AS $$
BEGIN
  -- This is a simplified version for MVP
  -- In production, this would use PostGIS for proper geospatial matching
  RETURN QUERY
  SELECT 
    r.user_id,
    p.name,
    RANDOM() * 100 as route_similarity,
    RANDOM() * 100 as time_compatibility,
    r.start_lat,
    r.start_lon,
    r.end_lat,
    r.end_lon
  FROM routes r
  JOIN profiles p ON r.user_id = p.id
  WHERE r.user_id != find_matches.user_id
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_routes_user_id ON routes(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_timestamp ON checkins(timestamp);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_matched_user_id ON matches(matched_user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_sender_id ON buddy_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_receiver_id ON buddy_requests(receiver_id);