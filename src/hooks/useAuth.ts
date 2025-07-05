import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthUser, getCurrentUser } from '../lib/auth';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Create a callback to handle user state updates
  const updateUser = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    try {
      console.log('🔄 Updating user state for:', authUser.email);
      const userData = await getCurrentUser();
      console.log('✅ User data retrieved:', userData?.name || userData?.email);
      setUser(userData);
    } catch (error) {
      console.error('❌ Error updating user:', error);
      // If profile fetch fails, set basic user info
      setUser({
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || null,
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Auth initialization timeout, proceeding without auth');
            setUser(null);
            setLoading(false);
          }
        }, 3000);

        try {
          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          // Clear the timeout if we get a response
          clearTimeout(timeoutId);
          
          if (mounted) {
            if (session?.user && !error) {
              console.log('👤 Found existing session, updating user...');
              await updateUser(session.user);
            } else {
              if (error) {
                console.error('❌ Session error:', error.message);
              } else {
                console.log('👤 No existing session');
              }
              setUser(null);
            }
            setLoading(false);
          }
        } catch (sessionError) {
          clearTimeout(timeoutId);
          console.error('❌ Session error:', sessionError);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;
          
          console.log('🔐 Auth state change:', event, session?.user?.email || 'No user');
          
          // Always set loading to false when we get an auth state change
          setLoading(false);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('👤 User authenticated, updating user state...');
            await updateUser(session?.user || null);
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            setUser(null);
          }
        }
      );
      subscription = data.subscription;
    } catch (error) {
      console.error('❌ Error setting up auth listener:', error);
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [updateUser]);

  return { user, loading };
};