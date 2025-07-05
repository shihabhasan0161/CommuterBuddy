import { supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export const signUp = async (email: string, password: string, name: string) => {
  console.log('🔐 Attempting signup for:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    console.error('❌ Signup error:', error.message);
    throw error;
  }

  console.log('✅ Signup successful:', data.user?.email, 'Confirmed:', !!data.user?.email_confirmed_at);

  // For development, check if email confirmation is disabled
  if (data.user && data.user.email_confirmed_at) {
    console.log('🎉 User is already confirmed, creating profile...');
    // Create profile immediately since user is confirmed
    try {
      const profileResult = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
        commuter_points: 0,
      });
      
      if (profileResult.error) {
        console.error('❌ Profile creation error:', profileResult.error);
        // Don't throw here as the user was created successfully
      } else {
        console.log('✅ Profile created successfully');
      }
    } catch (profileError) {
      console.error('❌ Error creating profile:', profileError);
    }
  } else if (data.user) {
    console.log('📧 User created but needs email confirmation');
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  console.log('🔐 Attempting signin for:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ Signin error:', error.message);
    throw error;
  }
  
  console.log('✅ Signin successful:', data.user?.email);
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('👤 No session found');
      return null;
    }

    console.log('👤 Session found for user:', session.user.email);

    // For faster loading, return user data immediately and handle profile creation separately
    const userData = {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata?.name || null,
    };

    // Try to get the profile in the background
    supabase
      .from('profiles')
      .select('name')
      .eq('id', session.user.id)
      .single()
      .then(({ error }) => {
        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it in the background
          console.log('🔧 Creating profile in background...');
          supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              name: session.user.user_metadata?.name || '',
              email: session.user.email!,
              commuter_points: 0,
            })
            .then(({ error: createError }) => {
              if (createError) {
                console.error('❌ Error creating profile:', createError);
              } else {
                console.log('✅ Profile created successfully');
              }
            });
        } else if (error) {
          console.error('❌ Error fetching profile:', error);
        }
      });

    return userData;
  } catch (error) {
    console.error('❌ Error in getCurrentUser:', error);
    return null;
  }
};

export const getAuthSession = () => {
  return supabase.auth.getSession();
};