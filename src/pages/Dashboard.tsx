import React from 'react';
import { RefreshCw, Users, MapPin, Star } from 'lucide-react';
import { BuddyCard } from '../components/BuddyCard';
import { useMatches } from '../hooks/useMatches';

interface DashboardProps {
  userId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const { matches, loading, error, refetch } = useMatches(userId);

  const handleInvite = (matchedUserId: string) => {
    // TODO: Implement invite functionality
    console.log('Invite user:', matchedUserId);
  };

  const handleMessage = (matchedUserId: string) => {
    // TODO: Implement messaging functionality
    console.log('Message user:', matchedUserId);
  };

  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
            <p className="text-xs text-gray-500">Matches</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <MapPin className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500">Routes</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-xs text-gray-500">Points</p>
          </div>
        </div>

        {/* Matches Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Potential Buddies</h2>
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Matches List */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600 mb-4">
              Add your commute routes to find potential buddies
            </p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Add Route
            </button>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="space-y-4">
            {matches.map((match) => (
              <BuddyCard
                key={match.user_id}
                match={match}
                onInvite={handleInvite}
                onMessage={handleMessage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};