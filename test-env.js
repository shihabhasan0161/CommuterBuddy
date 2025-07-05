// Simple test to verify environment variables are loaded
console.log('Environment variables test:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Set' : 'Not set');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
console.log('VITE_GOOGLE_MAPS_API_KEY:', process.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set' : 'Not set');

// Load environment variables from .env file
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    console.log('\n.env file contents:');
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          console.log(`${key}: ${value.length > 20 ? value.substring(0, 20) + '...' : value}`);
        }
      }
    });
  } else {
    console.log('.env file not found');
  }
} catch (error) {
  console.error('Error reading .env file:', error);
}
