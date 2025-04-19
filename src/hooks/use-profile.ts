
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  bio: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        // Ensure we're setting a Profile type with all required properties
        setProfile(data as Profile);
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
    }

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!userId) {
        console.error('Cannot update profile: No user ID available');
        return;
      }

      console.log('Updating profile with:', updates);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      setProfile((prev) => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error; // Re-throw to allow caller to handle
    }
  };

  return { profile, loading, updateProfile };
}
