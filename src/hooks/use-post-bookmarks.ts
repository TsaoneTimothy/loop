
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";

export function usePostBookmarks(toggleSaved: (id: number) => void) {
  const { toast } = useToast();
  const { isAuthenticated, userId } = useProfile();
  
  const handleBookmark = async (id: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark posts",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if the user has already bookmarked this post
      const { data: existingBookmark } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .eq('listing_id', String(id))
        .single();

      if (existingBookmark) {
        // Remove the bookmark
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', String(id));

        // Update the parent component's state
        toggleSaved(id);
        
        toast({
          title: "Bookmark removed",
          description: "Post removed from your bookmarks",
        });
      } else {
        // Add the bookmark
        await supabase
          .from('bookmarks')
          .insert([
            { user_id: userId, listing_id: String(id) }
          ]);

        // Update the parent component's state
        toggleSaved(id);
        
        toast({
          title: "Post bookmarked",
          description: "Post added to your bookmarks",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
    }
  };

  return {
    handleBookmark
  };
}
