import { supabase } from './supabaseClient';

export interface Route {
  id: string;
  user_id: string;
  name: string;
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
  usual_time: string;
  created_at: string;
}

export interface RouteWithUser extends Route {
  user_name?: string;
}

export const createRoute = async (routeData: Omit<Route, 'id' | 'created_at' | 'user_id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('routes')
    .insert({
      ...routeData,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserRoutes = async (userId: string): Promise<Route[]> => {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getAllRoutesWithUsers = async (): Promise<RouteWithUser[]> => {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      profiles!routes_user_id_fkey(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(route => ({
    ...route,
    user_name: route.profiles?.name || 'Anonymous',
  }));
};

export const updateRoute = async (id: string, updates: Partial<Route>) => {
  const { data, error } = await supabase
    .from('routes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRoute = async (id: string) => {
  const { error } = await supabase
    .from('routes')
    .delete()
    .eq('id', id);

  if (error) throw error;
};