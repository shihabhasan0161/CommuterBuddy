import React from 'react';
import { MapPin, Users, Route, Clock, ArrowRight, Star, Shield, Zap } from 'lucide-react';

interface HeroProps {
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
}

export const Hero: React.FC<HeroProps> = ({ user }) => {
  const features = [
    {
      icon: Users,
      title: 'Find Commute Buddies',
      description: 'Connect with fellow commuters on similar routes for safer, more enjoyable journeys.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Route,
      title: 'Smart Route Matching',
      description: 'Our AI matches you with commuters based on your route, schedule, and preferences.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: MapPin,
      title: 'Real-time Tracking',
      description: 'Stay safe with live location sharing and emergency SOS features.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Verified profiles, safety ratings, and emergency contacts for peace of mind.',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: Zap,
      title: 'Instant Connections',
      description: 'Connect instantly with nearby commuters and coordinate your journey.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Clock,
      title: 'Time Optimization',
      description: 'Save time with route optimization and traffic updates.',
      color: 'from-indigo-400 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {user ? 'Welcome back,' : 'Welcome to'}
              </span>
              <br />
              <span className="text-white">
                {user ? (user.name || 'Commuter') + '!' : 'CommuterBuddy'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Ready to transform your daily commute? Connect with like-minded travelers,
              share routes, and make your journey safer and more enjoyable.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25 flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-white/20 flex items-center space-x-2">
                <MapPin size={20} />
                <span>Find Nearby Routes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">10K+</div>
              <div className="text-gray-300">Active Commuters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-300">Routes Shared</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-gray-300">Safety Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Create Your Profile</h3>
              <p className="text-gray-300">Set up your commute preferences, routes, and safety settings.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Find Matches</h3>
              <p className="text-gray-300">Our AI connects you with compatible commuters on similar routes.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Start Commuting</h3>
              <p className="text-gray-300">Connect, coordinate, and enjoy safer, more social commutes.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Commute?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of commuters who are already enjoying safer, more connected journeys.
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
