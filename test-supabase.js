// Quick test to verify Supabase connection and authentication
import { supabase } from './src/lib/supabaseClient.ts';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if supabase client is initialized
    console.log('Supabase URL:', supabase.supabaseUrl);
    console.log('Supabase Key (first 20 chars):', supabase.supabaseKey.substring(0, 20) + '...');
    
    // Test 2: Test a simple query
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Database connection error:', error);
    } else {
      console.log('Database connection successful');
    }
    
    // Test 3: Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'User is logged in' : 'No session');
    
    // Test 4: Test authentication state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.id);
    });
    
    console.log('All tests completed successfully!');
    subscription.unsubscribe();
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSupabaseConnection();
