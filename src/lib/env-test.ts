// Quick environment test
import { supabase } from '../lib/supabaseClient';
import { signUp, signIn } from './auth';

export const testEnvironment = async () => {
  console.log('🔧 Testing environment...');
  
  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('🔗 Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('🔑 Supabase Key:', supabaseKey ? 'Set' : 'Missing');
  
  // Test Supabase connection
  try {
    const { error } = await supabase.auth.getSession();
    console.log('✅ Supabase connection test:', error ? 'Failed' : 'Success');
    if (error) console.error('Connection error:', error);
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
  }
  
  // Test if we can query the database
  try {
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    console.log('✅ Database query test:', error ? 'Failed' : 'Success');
    if (error) console.error('Query error:', error);
  } catch (err) {
    console.error('❌ Database query failed:', err);
  }
};

// Test function for authentication
export const testAuth = async () => {
  console.log('🔐 Testing authentication...');
  
  const testEmail = 'test@example.com';
  const testPassword = 'password123';
  const testName = 'Test User';
  
  try {
    // Try to sign up
    const signupResult = await signUp(testEmail, testPassword, testName);
    console.log('📝 Signup test result:', signupResult);
    
    // Try to sign in
    const signinResult = await signIn(testEmail, testPassword);
    console.log('🔐 Signin test result:', signinResult);
    
    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('👤 Current session:', session?.user?.email || 'No session');
    
  } catch (error) {
    console.error('❌ Auth test failed:', error);
  }
};

// Make functions available globally for testing
(window as unknown as Record<string, unknown>).testEnvironment = testEnvironment;
(window as unknown as Record<string, unknown>).testAuth = testAuth;

// Run the test
testEnvironment();
