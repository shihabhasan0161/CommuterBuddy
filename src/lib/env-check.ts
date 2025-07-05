import { supabase } from './supabaseClient';

// Environment configuration check
console.log('🔍 Environment Check:');
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('Google Maps API:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Missing');

// Test Supabase connection (non-blocking)
supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(({ error, count }) => {
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
    } else {
      console.log('✅ Supabase connection successful, profiles count:', count);
    }
  });

// Test auth state (non-blocking)
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('❌ Auth session error:', error.message);
  } else {
    console.log('🔐 Current auth session:', session ? `User: ${session.user.email}` : 'No session');
  }
});

export const checkEnvironment = () => {
  const missing = [];
  if (!import.meta.env.VITE_SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missing.push('VITE_SUPABASE_ANON_KEY');
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) missing.push('VITE_GOOGLE_MAPS_API_KEY');
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};
