import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Login } from './pages/Login';
import { Map } from './pages/Map';
import { Routes } from './pages/Routes';
import { Profile } from './pages/Profile';
import { Buddies } from './pages/Buddies';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fallback mechanism to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log('⏰ Loading timeout reached, forcing render');
        setForceRender(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timer);
  }, [loading]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    console.log('🎉 Authentication successful in App, redirecting to home');
    setActiveSection('home');
  };

  // If user becomes authenticated while on login page, redirect to home
  useEffect(() => {
    if (user && activeSection === 'login') {
      console.log('🏠 User authenticated, redirecting from login to home');
      setActiveSection('home');
    }
  }, [user, activeSection]);

  // Show login screen only when explicitly requested and user is not authenticated
  if (activeSection === 'login' && !user && !loading) {
    return <Login onAuthSuccess={handleAuthSuccess} />;
  }

  // Show loading spinner while auth is being determined (with timeout)
  if (loading && !forceRender) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading CommuterBuddy...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we initialize your session</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Hero user={user} />;
      case 'buddies':
        return <Buddies />;
      case 'map':
        return <Map userId={user?.id || 'guest'} />;
      case 'routes':
        return <Routes userId={user?.id || 'guest'} />;
      case 'profile':
        return user ? <Profile user={user} /> : <Login onAuthSuccess={handleAuthSuccess} />;
      default:
        return <Hero user={user} />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar
          user={user}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="min-h-screen">
          {renderContent()}
        </main>
      </div>
    </Router>
  );
}

export default App;