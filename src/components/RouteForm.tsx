import React, { useState } from 'react';
import { MapPin, Clock, Save, X } from 'lucide-react';
import { GoogleMapView } from './GoogleMapView';

interface RouteFormProps {
  onSave: (route: RouteData) => void;
  onCancel: () => void;
  initialData?: Partial<RouteData>;
}

interface RouteData {
  name: string;
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
  usual_time: string;
}

export const RouteForm: React.FC<RouteFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<RouteData>>({
    name: '',
    usual_time: '',
    ...initialData,
  });
  const [mapMode, setMapMode] = useState<'start' | 'end' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMapClick = (lat: number, lng: number) => {
    if (mapMode === 'start') {
      setFormData(prev => ({ ...prev, start_lat: lat, start_lon: lng }));
      setMapMode('end');
    } else if (mapMode === 'end') {
      setFormData(prev => ({ ...prev, end_lat: lat, end_lon: lng }));
      setMapMode(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Route name is required';
    }
    if (!formData.usual_time?.trim()) {
      newErrors.usual_time = 'Usual time is required';
    }
    if (!formData.start_lat || !formData.start_lon) {
      newErrors.start = 'Please select a start location on the map';
    }
    if (!formData.end_lat || !formData.end_lon) {
      newErrors.end = 'Please select an end location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData as RouteData);
    }
  };

  const mapCenter = formData.start_lat && formData.start_lon 
    ? { lat: formData.start_lat, lng: formData.start_lon }
    : undefined;

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Route' : 'Add New Route'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Route Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Route Name
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Home to Office"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Usual Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Usual Commute Time
          </label>
          <input
            type="text"
            value={formData.usual_time || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, usual_time: e.target.value }))}
            placeholder="e.g., Mon-Fri 8:00 AM, Weekdays 6:00 PM"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.usual_time ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.usual_time && <p className="text-sm text-red-600 mt-1">{errors.usual_time}</p>}
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Route Locations
          </label>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => setMapMode('start')}
              className={`p-3 border-2 border-dashed rounded-lg text-center transition-colors ${
                mapMode === 'start' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : formData.start_lat 
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <MapPin className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">
                {formData.start_lat ? 'Start Location Set' : 'Set Start Location'}
              </div>
              {mapMode === 'start' && (
                <div className="text-xs text-blue-600 mt-1">Click on map</div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMapMode('end')}
              className={`p-3 border-2 border-dashed rounded-lg text-center transition-colors ${
                mapMode === 'end' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : formData.end_lat 
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <MapPin className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">
                {formData.end_lat ? 'End Location Set' : 'Set End Location'}
              </div>
              {mapMode === 'end' && (
                <div className="text-xs text-blue-600 mt-1">Click on map</div>
              )}
            </button>
          </div>

          {(errors.start || errors.end) && (
            <p className="text-sm text-red-600 mb-2">
              {errors.start || errors.end}
            </p>
          )}

          {/* Map */}
          <div className="h-64 border border-gray-300 rounded-lg overflow-hidden">
            <GoogleMapView
              center={mapCenter}
              zoom={13}
              onMapClick={mapMode ? handleMapClick : undefined}
              routes={formData.start_lat && formData.end_lat ? [{
                id: 'preview',
                user_id: 'current',
                name: formData.name || 'New Route',
                start_lat: formData.start_lat,
                start_lon: formData.start_lon,
                end_lat: formData.end_lat,
                end_lon: formData.end_lon,
              }] : []}
            />
          </div>

          {mapMode && (
            <p className="text-sm text-blue-600 mt-2">
              {mapMode === 'start' 
                ? 'Click on the map to set your start location' 
                : 'Click on the map to set your end location'
              }
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Route</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};