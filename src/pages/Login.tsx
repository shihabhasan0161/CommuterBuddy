import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { signIn, signUp } from '../lib/auth';
import { useAuth } from '../hooks/useAuth';

interface LoginProps {
  onAuthSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // If user becomes authenticated, call success callback
  useEffect(() => {
    console.log('🔐 Login component - user state changed:', user ? `${user.name} (${user.email})` : 'No user');
    if (user && onAuthSuccess) {
      console.log('🎉 Authentication successful, calling success callback');
      // Stop loading when user is authenticated
      setLoading(false);
      // Call success callback
      onAuthSuccess();
    }
  }, [user, onAuthSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const result = await signUp(formData.email, formData.password, formData.name);
        console.log('📝 Signup result:', result);
        
        if (result.user && !result.user.email_confirmed_at) {
          // User needs to confirm email
          setError('Please check your email to confirm your account before signing in.');
          setIsSignUp(false);
          setLoading(false);
          return;
        }
        
        if (result.user && result.user.email_confirmed_at) {
          // User is created and confirmed, they should be signed in automatically
          console.log('✅ User created and confirmed, waiting for auth state change...');
          // The auth state change should trigger automatically
        } else {
          // User was created but not confirmed
          setError('Account created! Please check your email to confirm your account, then sign in.');
          setIsSignUp(false);
          setLoading(false);
          return;
        }
        
      } else {
        const result = await signIn(formData.email, formData.password);
        console.log('🔐 Signin result:', result);
        
        if (result.user) {
          console.log('✅ User signed in successfully, waiting for auth state change...');
          // The auth state change should trigger and update the user state
        }
      }
      
      // Add a timeout to prevent infinite loading if auth state change doesn't fire
      setTimeout(() => {
        if (loading) {
          console.log('⏰ Auth state change timeout, stopping loading');
          setLoading(false);
        }
      }, 3000);
      
    } catch (err) {
      console.error('❌ Authentication error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (err.message.includes('Email not confirmed')) {
          setError('Please confirm your email before signing in.');
        } else if (err.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
          setIsSignUp(false);
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-2xl font-bold text-white">CB</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              CommuterBuddy
            </h1>
            <p className="text-gray-300 text-lg">
              {isSignUp ? 'Join the commuting revolution' : 'Welcome back, traveler'}
            </p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Sparkles className="text-yellow-400" size={16} />
              <span className="text-yellow-400 text-sm font-medium">Your journey starts here</span>
              <Sparkles className="text-yellow-400" size={16} />
            </div>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {isSignUp && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={isSignUp}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-xl hover:shadow-cyan-500/25"
              >
                <span className="flex items-center justify-center space-x-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                {isSignUp ? 'Sign in here' : 'Create one now'}
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-xs text-gray-300">Safe & Secure</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-sm">★</span>
                  </div>
                  <p className="text-xs text-gray-300">Trusted by 10k+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
