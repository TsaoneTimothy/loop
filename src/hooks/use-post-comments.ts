
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";

export function usePostComments() {
  const { toast } = useToast();
  const { isAuthenticated, userId } = useProfile();
  
  const handleAddComment = async (id: number, comment: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return false;
    }

    try {
      await supabase
        .from('comments')
        .insert([
          { 
            user_id: userId, 
            listing_id: String(id),
            content: comment
          }
        ]);
      
      toast({
        title: "Comment added",
        description: "Your comment was posted successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment",
        variant: "destructive",
      });
      
      return false;
    }
  };

  return {
    handleAddComment
  };
}
