import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { RouteForm } from '../components/RouteForm';
import { getUserRoutes, createRoute, updateRoute, deleteRoute, Route } from '../lib/routes';

interface RoutesProps {
  userId: string;
}

export const Routes: React.FC<RoutesProps> = ({ userId }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRoutes = useCallback(async () => {
    if (userId === 'guest') {
      setRoutes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userRoutes = await getUserRoutes(userId);
      setRoutes(userRoutes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const handleSaveRoute = async (routeData: {
    name: string;
    start_lat: number;
    start_lon: number;
    end_lat: number;
    end_lon: number;
    usual_time: string;
  }) => {
    try {
      if (editingRoute) {
        const updatedRoute = await updateRoute(editingRoute.id, routeData);
        setRoutes(prev => prev.map(r => r.id === editingRoute.id ? updatedRoute : r));
      } else {
        const newRoute = await createRoute(routeData);
        setRoutes(prev => [...prev, newRoute]);
      }
      setShowForm(false);
      setEditingRoute(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save route');
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    
    try {
      await deleteRoute(id);
      setRoutes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete route');
    }
  };

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RouteForm
            onSave={handleSaveRoute}
            onCancel={() => {
              setShowForm(false);
              setEditingRoute(null);
            }}
            initialData={editingRoute || undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Routes
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plan and manage your daily commute routes.
          </p>
        </div>

        {/* Guest Warning */}
        {userId === 'guest' && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-8 text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Sign in to Save Routes</h3>
            <p className="text-yellow-200">Create an account to save and manage your commute routes.</p>
          </div>
        )}

        {/* Routes List */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Saved Routes</h2>
            <button
              onClick={() => userId === 'guest' ? alert('Please sign in to create routes') : setShowForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Route</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading routes...</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">No routes saved yet</p>
              <p className="text-gray-500 text-sm">
                {userId === 'guest' ? 'Sign in to create your first route' : 'Create your first route to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {routes.map((route) => (
                <div key={route.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">{route.name}</h3>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span>From: {route.start_lat.toFixed(4)}, {route.start_lon.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-400" />
                          <span>To: {route.end_lat.toFixed(4)}, {route.end_lon.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>Usual time: {route.usual_time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditRoute(route)}
                        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
