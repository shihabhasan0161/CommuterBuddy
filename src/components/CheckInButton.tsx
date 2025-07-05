import React from 'react';
import { Play, Square } from 'lucide-react';

interface CheckInButtonProps {
  type: 'depart' | 'arrive';
  onCheckIn: (type: 'depart' | 'arrive') => void;
  onSOS: () => void;
  disabled?: boolean;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  type,
  onCheckIn,
  onSOS,
  disabled = false,
}) => {
  const handleCheckIn = () => {
    if (!disabled) {
      onCheckIn(type);
    }
  };

  const handleSOS = () => {
    if (window.confirm('Are you sure you want to send an emergency SOS alert?')) {
      onSOS();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Check-in Button */}
      <button
        onClick={handleCheckIn}
        disabled={disabled}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
          disabled 
            ? 'bg-gray-300 cursor-not-allowed' 
            : type === 'depart'
            ? 'bg-green-500 hover:bg-green-600 active:scale-95'
            : 'bg-red-500 hover:bg-red-600 active:scale-95'
        } shadow-lg`}
      >
        {type === 'depart' ? (
          <Play size={24} className="text-white ml-1" />
        ) : (
          <Square size={20} className="text-white" />
        )}
      </button>
      
      <div className="text-center">
        <p className="text-sm font-medium text-white">
          {type === 'depart' ? 'Start Journey' : 'End Journey'}
        </p>
        <p className="text-xs text-gray-300">
          {disabled ? 'Location required' : 'Tap to check in'}
        </p>
      </div>

      {/* SOS Button */}
      <button
        onClick={handleSOS}
        className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg"
        title="Emergency SOS"
      >
        <span className="text-white font-bold text-xs">SOS</span>
      </button>
    </div>
  );
};
