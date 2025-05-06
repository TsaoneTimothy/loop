
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Check session and set up auth listener
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Auth session in useProfile:", data.session);
        setSession(data.session);
        setUser(data.session?.user || null);
        setUserId(data.session?.user?.id);
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Error getting session:", error);
        setIsAuthenticated(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user || null);
        setUserId(newSession?.user?.id);
        setIsAuthenticated(!!newSession);
      }
    );

    getSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profile data when userId changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          console.log("No user ID available to fetch profile");
          setLoading(false);
          return;
        }
        
        console.log("Fetching profile for user ID:", userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        console.log("Fetched profile data:", data);

        if (data) {
          setProfile(data as Profile);
        } else {
          // If profile doesn't exist, create a bare-bones one
          console.log("No profile found, will create on first update");
          setProfile({
            id: userId,
            full_name: user?.user_metadata?.full_name || null,
            avatar_url: null,
            bio: null
          });
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        toast({
          title: "Error fetching profile",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user]);

  const updateProfile = async (updates: Partial<Profile> & { email?: string; avatar_url?: string | null }) => {
    try {
      if (!userId) {
        console.error('Cannot update profile: No user ID available');
        toast({
          title: "Authentication required",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return null;
      }

      console.log('Updating profile with:', updates);
      
      // Remove email from updates as it's not part of the profiles table
      const { email, ...profileUpdates } = updates;
      
      // Make sure the full_name field is included and not null
      const updatedProfile = {
        ...profileUpdates,
        id: userId,
        full_name: profileUpdates.full_name || profile?.full_name || ''
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updatedProfile)
        .select();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log("Profile update response:", data);
      
      // Update local state with the latest profile data
      if (data && data.length > 0) {
        setProfile(prev => ({ ...prev, ...data[0] }));
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        });
        
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { profile, user, session, loading, updateProfile, isAuthenticated, userId };
}
