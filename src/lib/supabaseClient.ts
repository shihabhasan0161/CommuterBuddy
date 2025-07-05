import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define a proper type for GPX data
export interface GPXData {
  tracks?: Array<{
    name?: string;
    segments?: Array<{
      points?: Array<{
        lat: number;
        lon: number;
        elevation?: number;
        time?: string;
      }>;
    }>;
  }>;
  waypoints?: Array<{
    lat: number;
    lon: number;
    name?: string;
    description?: string;
  }>;
  routes?: Array<{
    name?: string;
    points?: Array<{
      lat: number;
      lon: number;
    }>;
  }>;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          emergency_contact: string;
          commuter_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          emergency_contact?: string;
          commuter_points?: number;
        };
        Update: {
          name?: string;
          email?: string;
          emergency_contact?: string;
          commuter_points?: number;
        };
      };
      routes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          start_lat: number;
          start_lon: number;
          end_lat: number;
          end_lon: number;
          usual_time: string;
          gpx_data: GPXData | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          start_lat: number;
          start_lon: number;
          end_lat: number;
          end_lon: number;
          usual_time: string;
          gpx_data?: GPXData | null;
        };
        Update: {
          name?: string;
          start_lat?: number;
          start_lon?: number;
          end_lat?: number;
          end_lon?: number;
          usual_time?: string;
          gpx_data?: GPXData | null;
        };
      };
      checkins: {
        Row: {
          id: string;
          user_id: string;
          type: 'depart' | 'arrive';
          lat: number;
          lon: number;
          timestamp: string;
          route_id?: string;
        };
        Insert: {
          user_id: string;
          type: 'depart' | 'arrive';
          lat: number;
          lon: number;
          route_id?: string;
        };
        Update: {
          type?: 'depart' | 'arrive';
          lat?: number;
          lon?: number;
          route_id?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          user_id: string;
          matched_user_id: string;
          route_similarity: number;
          time_compatibility: number;
          status: 'pending' | 'accepted' | 'declined';
          created_at: string;
        };
        Insert: {
          user_id: string;
          matched_user_id: string;
          route_similarity: number;
          time_compatibility: number;
          status?: 'pending' | 'accepted' | 'declined';
        };
        Update: {
          status?: 'pending' | 'accepted' | 'declined';
        };
      };
    };
  };
};