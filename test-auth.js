// Test authentication flow
// This script can be run in the browser console to test the authentication

// Test signup
const testSignup = async () => {
  console.log('🧪 Testing signup...');
  
  try {
    // Import the auth functions
    const { signUp } = await import('./src/lib/auth.ts');
    
    const testUser = {
      email: 'test@example.com',
      password: 'testpassword123',
      name: 'Test User'
    };
    
    const result = await signUp(testUser.email, testUser.password, testUser.name);
    console.log('✅ Signup test result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Signup test error:', error);
    return null;
  }
};

// Test signin
const testSignin = async () => {
  console.log('🧪 Testing signin...');
  
  try {
    // Import the auth functions
    const { signIn } = await import('./src/lib/auth.ts');
    
    const testUser = {
      email: 'test@example.com',
      password: 'testpassword123'
    };
    
    const result = await signIn(testUser.email, testUser.password);
    console.log('✅ Signin test result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Signin test error:', error);
    return null;
  }
};

// Test current user
const testCurrentUser = async () => {
  console.log('🧪 Testing current user...');
  
  try {
    // Import the auth functions
    const { getCurrentUser } = await import('./src/lib/auth.ts');
    
    const user = await getCurrentUser();
    console.log('✅ Current user test result:', user);
    
    return user;
  } catch (error) {
    console.error('❌ Current user test error:', error);
    return null;
  }
};

// Export functions to global scope for easy testing
window.testSignup = testSignup;
window.testSignin = testSignin;
window.testCurrentUser = testCurrentUser;

console.log('🧪 Authentication test functions loaded. You can now run:');
console.log('- testSignup()');
console.log('- testSignin()');
console.log('- testCurrentUser()');
