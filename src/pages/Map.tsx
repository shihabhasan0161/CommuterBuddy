import React, { useState, useEffect } from 'react';
import { GoogleMapView } from '../components/GoogleMapView';
import { CheckInButton } from '../components/CheckInButton';
import { useGeolocation } from '../hooks/useGeolocation';
import { createCheckIn, sendSOS } from '../lib/api';
import { getAllRoutesWithUsers, RouteWithUser } from '../lib/routes';
import { MapPin, Navigation, Users, Clock, AlertTriangle, Zap } from 'lucide-react';

interface MapProps {
  userId: string;
}

export const Map: React.FC<MapProps> = ({ userId }) => {
  const location = useGeolocation(true);
  const [lastCheckIn, setLastCheckIn] = useState<'depart' | 'arrive' | null>(null);
  const [routes, setRoutes] = useState<RouteWithUser[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const allRoutes = await getAllRoutesWithUsers();
      setRoutes(allRoutes);
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleCheckIn = async (type: 'depart' | 'arrive') => {
    if (!location.latitude || !location.longitude) return;
    if (userId === 'guest') {
      alert('Please sign in to use check-in features');
      return;
    }

    try {
      await createCheckIn(userId, type, location.latitude, location.longitude);
      setLastCheckIn(type);
      
      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Check-in successful`, {
          body: `You have ${type === 'depart' ? 'started' : 'ended'} your journey`,
          icon: '/favicon.ico',
        });
      }
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleSOS = async () => {
    if (!location.latitude || !location.longitude) return;

    try {
      await sendSOS(location.latitude, location.longitude);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('SOS Alert Sent', {
          body: 'Emergency services and contacts have been notified',
          icon: '/favicon.ico',
        });
      }
    } catch (error) {
      console.error('SOS failed:', error);
    }
  };

  const stats = [
    {
      icon: Users,
      label: 'Active Commuters',
      value: routes.length.toString(),
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: MapPin,
      label: 'Routes Visible',
      value: routes.length.toString(),
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Navigation,
      label: 'Your Location',
      value: location.latitude ? 'Found' : 'Searching...',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Clock,
      label: 'Last Check-in',
      value: lastCheckIn ? lastCheckIn : 'None',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Commute Map
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track your journey, find nearby commuters, and stay connected with your commute community.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">{stat.label}</p>
                    <p className="text-white font-semibold">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Container */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-96 lg:h-[500px] relative">
            {loadingRoutes ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Loading map data...</p>
                </div>
              </div>
            ) : (
              <GoogleMapView
                center={location.latitude && location.longitude ? {
                  lat: location.latitude,
                  lng: location.longitude
                } : undefined}
                zoom={13}
                routes={routes}
                userLocation={location.latitude && location.longitude ? {
                  lat: location.latitude,
                  lng: location.longitude
                } : undefined}
              />
            )}
          </div>

          {/* Action Panel */}
          <div className="p-6 border-t border-white/10">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Check-in Controls */}
              <div className="flex items-center space-x-4">
                <CheckInButton
                  type={lastCheckIn === 'depart' ? 'arrive' : 'depart'}
                  onCheckIn={handleCheckIn}
                  onSOS={handleSOS}
                  disabled={!location.latitude || !location.longitude}
                />
                
                <div className="text-center">
                  <p className="text-sm text-gray-300 mb-1">Journey Status</p>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lastCheckIn === 'depart' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : lastCheckIn === 'arrive'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {lastCheckIn === 'depart' ? 'In Transit' : lastCheckIn === 'arrive' ? 'Arrived' : 'Not Started'}
                  </div>
                </div>
              </div>

              {/* Emergency Button */}
              <button
                onClick={handleSOS}
                className="group bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-red-500/25 flex items-center space-x-2"
              >
                <AlertTriangle size={20} className="group-hover:animate-pulse" />
                <span>Emergency SOS</span>
              </button>

              {/* Location Info */}
              <div className="text-center lg:text-right">
                <p className="text-sm text-gray-300 mb-1">Your Location</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${location.latitude ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-white text-sm font-medium">
                    {location.latitude && location.longitude 
                      ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                      : 'Location unavailable'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6 text-center">
            <Navigation className="mx-auto mb-4 text-blue-400" size={40} />
            <h3 className="text-lg font-semibold text-white mb-2">Smart Navigation</h3>
            <p className="text-gray-300 text-sm">Real-time route optimization based on traffic and buddy locations</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6 text-center">
            <Users className="mx-auto mb-4 text-purple-400" size={40} />
            <h3 className="text-lg font-semibold text-white mb-2">Buddy Tracking</h3>
            <p className="text-gray-300 text-sm">See nearby commute buddies and coordinate meetups</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6 text-center">
            <Zap className="mx-auto mb-4 text-green-400" size={40} />
            <h3 className="text-lg font-semibold text-white mb-2">Live Updates</h3>
            <p className="text-gray-300 text-sm">Get instant notifications about route changes and delays</p>
          </div>
        </div>
      </div>
    </div>
  );
};
