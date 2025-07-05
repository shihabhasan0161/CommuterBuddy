// Test authentication flow step by step
console.log('=== Authentication Flow Test ===');

// Test 1: Check if Supabase is properly initialized
const testSupabaseInit = () => {
  console.log('1. Testing Supabase initialization...');
  
  if (!window.supabase) {
    console.log('❌ Supabase not available on window');
    return false;
  }
  
  console.log('✅ Supabase client available');
  return true;
};

// Test 2: Test authentication flow
const testAuthFlow = async () => {
  console.log('2. Testing authentication flow...');
  
  try {
    // Create a unique test email
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    const testName = 'Test User';
    
    console.log('📧 Testing with:', testEmail);
    
    // Test signup
    console.log('🔐 Step 1: Testing signup...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { name: testName }
      }
    });
    
    if (signUpError) {
      console.error('❌ Signup failed:', signUpError.message);
      return false;
    }
    
    console.log('✅ Signup successful:', signUpData);
    console.log('User confirmed:', !!signUpData.user?.email_confirmed_at);
    
    // Test signin
    console.log('🔐 Step 2: Testing signin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (signInError) {
      console.error('❌ Signin failed:', signInError.message);
      return false;
    }
    
    console.log('✅ Signin successful:', signInData);
    
    // Test session
    console.log('🔐 Step 3: Testing session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError.message);
      return false;
    }
    
    console.log('✅ Session check successful:', session ? 'Session exists' : 'No session');
    
    return true;
    
  } catch (error) {
    console.error('❌ Authentication flow test failed:', error);
    return false;
  }
};

// Test 3: Test profile creation
const testProfileCreation = async () => {
  console.log('3. Testing profile creation...');
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('❌ No session available for profile test');
      return false;
    }
    
    console.log('👤 Testing profile creation for user:', session.user.email);
    
    // Try to create a profile
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: session.user.id,
        name: 'Test User',
        email: session.user.email,
        commuter_points: 0,
      });
    
    if (error) {
      console.error('❌ Profile creation failed:', error.message);
      return false;
    }
    
    console.log('✅ Profile creation successful:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Profile creation test failed:', error);
    return false;
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🧪 Running all authentication tests...');
  
  const test1 = testSupabaseInit();
  if (!test1) return;
  
  const test2 = await testAuthFlow();
  if (!test2) return;
  
  const test3 = await testProfileCreation();
  if (!test3) return;
  
  console.log('✅ All authentication tests passed!');
};

// Make function available globally for testing
window.runAuthTests = runAllTests;

console.log('🧪 Authentication tests loaded. Run: runAuthTests()');
