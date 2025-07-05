import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // New York City default
};

interface RouteMarker {
  id: string;
  user_id: string;
  name: string;
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
  user_name?: string;
}

interface GoogleMapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  routes?: RouteMarker[];
  userLocation?: { lat: number; lng: number };
  onMapClick?: (lat: number, lng: number) => void;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  center = defaultCenter,
  zoom = 12,
  routes = [],
  userLocation,
  onMapClick,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<RouteMarker | null>(null);

  const onMapClickHandler = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng && onMapClick) {
      onMapClick(event.latLng.lat(), event.latLng.lng());
    }
  }, [onMapClick]);

  const routeIcon = {
    url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#14B8A6" stroke="#ffffff" stroke-width="2"/>
        <path d="M12 16l4 4 8-8" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(32, 32),
  };

  const userIcon = {
    url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" fill="#ffffff"/>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(24, 24),
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Fallback when API key is not available
  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="text-center z-10">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
          <p className="text-gray-600 mb-4 max-w-md">
            The interactive map will show commute routes and nearby buddies when fully configured.
          </p>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-sm text-gray-700">
              📍 Your routes and connections will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      loadingElement={
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      }
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onClick={onMapClickHandler}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={userIcon}
            title="Your location"
          />
        )}

        {/* Route markers */}
        {routes.map((route) => (
          <React.Fragment key={route.id}>
            <Marker
              position={{ lat: route.start_lat, lng: route.start_lon }}
              icon={routeIcon}
              title={`Route: ${route.name}`}
              onClick={() => setSelectedRoute(route)}
            />
            
            {/* Route polyline */}
            <Polyline
              path={[
                { lat: route.start_lat, lng: route.start_lon },
                { lat: route.end_lat, lng: route.end_lon },
              ]}
              options={{
                strokeColor: '#14B8A6',
                strokeOpacity: 0.7,
                strokeWeight: 3,
                geodesic: true,
              }}
            />
          </React.Fragment>
        ))}

        {/* Info window for selected route */}
        {selectedRoute && (
          <InfoWindow
            position={{ lat: selectedRoute.start_lat, lng: selectedRoute.start_lon }}
            onCloseClick={() => setSelectedRoute(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-gray-900 mb-1">{selectedRoute.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Created by: {selectedRoute.user_name || 'Anonymous'}
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                  View Details
                </button>
                <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                  Connect
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};