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
        if (!userId) return;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        // Ensure we're setting a Profile type with all required properties
        setProfile(data as Profile);
      } catch (error) {
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
      if (!profile?.id) return;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return { profile, loading, updateProfile };
}
