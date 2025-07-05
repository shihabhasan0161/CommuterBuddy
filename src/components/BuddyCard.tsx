import React from 'react';
import { MapPin, Clock, Star, MessageCircle } from 'lucide-react';
import { MatchResult } from '../lib/api';

interface BuddyCardProps {
  match: MatchResult;
  onInvite: (userId: string) => void;
  onMessage: (userId: string) => void;
}

export const BuddyCard: React.FC<BuddyCardProps> = ({ match, onInvite, onMessage }) => {
  const compatibilityScore = Math.round((match.route_similarity + match.time_compatibility) / 2);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {match.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{match.name}</h3>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500">{compatibilityScore}% match</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Similar route • {Math.round(match.route_similarity)}% overlap</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Time compatibility • {Math.round(match.time_compatibility)}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onInvite(match.user_id)}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Invite
          </button>
          <button
            onClick={() => onMessage(match.user_id)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-1"
          >
            <MessageCircle className="w-3 h-3" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};