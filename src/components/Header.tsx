import React from 'react';
import { User, Bell } from 'lucide-react';

interface HeaderProps {
  user: { name?: string; email: string } | null;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  notifications?: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onProfileClick,
  onSettingsClick,
  notifications = 0,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">CB</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">CommuterBuddy</h1>
            {user && (
              <p className="text-xs text-gray-500">
                Welcome, {user.name || user.email.split('@')[0]}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onProfileClick}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};