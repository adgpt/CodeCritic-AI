import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  provider: string;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserProfile = async (user: User) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select()
        .match({ id: user.id })
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', fetchError);
        return;
      }

      const updates = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        avatar_url: user.user_metadata.avatar_url,
        provider: user.app_metadata.provider,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (!existingProfile) {
        result = await supabase.from('user_profiles').upsert({
          ...updates,
          created_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      } else {
        result = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', user.id);
      }

      if (result.error) {
        console.error('Error updating user profile:', result.error);
        return;
      }

      const { data: updatedProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select()
        .match({ id: user.id })
        .single();

      if (profileError) {
        console.error('Error fetching updated profile:', profileError);
        return;
      }

      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error in profile update process:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await updateUserProfile(currentUser);
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await updateUserProfile(currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) throw error;
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signInWithGithub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };