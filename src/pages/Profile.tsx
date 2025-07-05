import React, { useState } from 'react';
import { Edit, Star, MapPin, Clock, Settings, LogOut } from 'lucide-react';
import { signOut } from '../lib/auth';

interface ProfileProps {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name || '',
    emergencyContact: '',
    commuteTimes: 'Mon-Fri, 8:00 AM - 6:00 PM',
    routes: 3,
    points: 156,
    journeys: 42,
  });

  const handleSave = () => {
    // TODO: Save profile changes
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.name || user.email.split('@')[0]}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-lg font-semibold text-gray-900">{profile.points}</span>
              </div>
              <p className="text-xs text-gray-500">Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <MapPin className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-lg font-semibold text-gray-900">{profile.routes}</span>
              </div>
              <p className="text-xs text-gray-500">Routes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-lg font-semibold text-gray-900">{profile.journeys}</span>
              </div>
              <p className="text-xs text-gray-500">Journeys</p>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.emergencyContact}
                  onChange={(e) => setProfile(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.emergencyContact || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usual Commute Times
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.commuteTimes}
                  onChange={(e) => setProfile(prev => ({ ...prev, commuteTimes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.commuteTimes}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center space-x-2 bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900">App Settings</span>
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 bg-red-50 p-4 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="text-red-600">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};