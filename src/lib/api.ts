import { supabase } from './supabaseClient';

export interface MatchResult {
  user_id: string;
  name: string;
  route_similarity: number;
  time_compatibility: number;
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
}

export const getMatches = async (userId: string): Promise<MatchResult[]> => {
  try {
    // For MVP, we'll simulate the PostGIS function with a simple query
    const { data, error } = await supabase
      .from('routes')
      .select(`
        user_id,
        name,
        start_lat,
        start_lon,
        end_lat,
        end_lon,
        usual_time,
        profiles(name)
      `)
      .neq('user_id', userId);

    if (error) {
      console.error('Error fetching matches:', error);
      throw new Error(`Failed to fetch matches: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Simple matching logic for MVP - with proper typing
    return data.map((route: {
      user_id: string;
      name?: string;
      start_lat: number;
      start_lon: number;
      end_lat: number;
      end_lon: number;
      usual_time: string;
      profiles: { name: string }[];
    }) => ({
      user_id: route.user_id,
      name: route.profiles?.[0]?.name || route.name || 'Unknown',
      route_similarity: Math.random() * 100, // Placeholder - could be replaced with actual distance calculation
      time_compatibility: Math.random() * 100, // Placeholder - could be replaced with time overlap calculation
      start_lat: route.start_lat,
      start_lon: route.start_lon,
      end_lat: route.end_lat,
      end_lon: route.end_lon,
    }));
  } catch (error) {
    console.error('Error in getMatches:', error);
    throw error;
  }
};

export const createCheckIn = async (
  userId: string,
  type: 'depart' | 'arrive',
  lat: number,
  lon: number,
  routeId?: string
) => {
  const { data, error } = await supabase
    .from('checkins')
    .insert({
      user_id: userId,
      type,
      lat,
      lon,
      route_id: routeId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const sendSOS = async (lat: number, lon: number) => {
  const { data, error } = await supabase.functions.invoke('send-sos', {
    body: { lat, lon },
  });

  if (error) throw error;
  return data;
};