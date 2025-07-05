import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, MapPin, Star, Plus, Search } from 'lucide-react';

interface BuddiesProps {
  userId: string;
}

interface Buddy {
  id: string;
  name: string;
  avatar: string;
  route: string;
  compatibility: number;
  lastSeen: string;
  rating: number;
  isOnline: boolean;
  mutualRoute: string;
}

export const Buddies: React.FC<BuddiesProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [buddies, setBuddies] = useState<Buddy[]>([]);

  // Mock data for now
  useEffect(() => {
    const mockBuddies: Buddy[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'SJ',
        route: 'Downtown → Tech District',
        compatibility: 95,
        lastSeen: '2 minutes ago',
        rating: 4.9,
        isOnline: true,
        mutualRoute: '85% route overlap'
      },
      {
        id: '2',
        name: 'Mike Chen',
        avatar: 'MC',
        route: 'Suburbs → City Center',
        compatibility: 87,
        lastSeen: '5 minutes ago',
        rating: 4.7,
        isOnline: true,
        mutualRoute: '78% route overlap'
      },
      {
        id: '3',
        name: 'Emily Davis',
        avatar: 'ED',
        route: 'North End → Business District',
        compatibility: 82,
        lastSeen: '1 hour ago',
        rating: 4.8,
        isOnline: false,
        mutualRoute: '92% route overlap'
      },
      {
        id: '4',
        name: 'Alex Rodriguez',
        avatar: 'AR',
        route: 'West Side → Downtown',
        compatibility: 79,
        lastSeen: '3 hours ago',
        rating: 4.6,
        isOnline: false,
        mutualRoute: '65% route overlap'
      }
    ];
    setBuddies(mockBuddies);
  }, []);

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buddy.route.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'online') return matchesSearch && buddy.isOnline;
    if (filter === 'offline') return matchesSearch && !buddy.isOnline;
    return matchesSearch;
  });

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 90) return 'from-green-400 to-emerald-500';
    if (compatibility >= 80) return 'from-blue-400 to-cyan-500';
    if (compatibility >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Commute Buddies
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with fellow commuters, share routes, and make your daily journey more enjoyable and safer.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search buddies or routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all" className="bg-gray-800">All Buddies</option>
              <option value="online" className="bg-gray-800">Online</option>
              <option value="offline" className="bg-gray-800">Offline</option>
            </select>
            
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2">
              <Plus size={20} />
              <span>Find New Buddies</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Buddies</p>
                <p className="text-2xl font-bold text-white">{buddies.length}</p>
              </div>
              <Users className="text-blue-400" size={28} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Online Now</p>
                <p className="text-2xl font-bold text-white">{buddies.filter(b => b.isOnline).length}</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Avg Compatibility</p>
                <p className="text-2xl font-bold text-white">86%</p>
              </div>
              <Star className="text-purple-400" size={28} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Shared Routes</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <MapPin className="text-yellow-400" size={28} />
            </div>
          </div>
        </div>

        {/* Buddies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuddies.map((buddy) => (
            <div 
              key={buddy.id}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{buddy.avatar}</span>
                    </div>
                    {buddy.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{buddy.name}</h3>
                    <p className="text-sm text-gray-400">{buddy.lastSeen}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-white text-sm font-medium">{buddy.rating}</span>
                </div>
              </div>

              {/* Route Info */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="text-cyan-400" size={16} />
                  <span className="text-gray-300 text-sm">{buddy.route}</span>
                </div>
                <div className="text-xs text-gray-400">{buddy.mutualRoute}</div>
              </div>

              {/* Compatibility */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Compatibility</span>
                  <span className="text-sm font-semibold text-white">{buddy.compatibility}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getCompatibilityColor(buddy.compatibility)}`}
                    style={{ width: `${buddy.compatibility}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                  <MessageCircle size={16} />
                  <span>Message</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center">
                  <MapPin size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBuddies.length === 0 && (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">No buddies found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or find new commute buddies</p>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
              Find New Buddies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
