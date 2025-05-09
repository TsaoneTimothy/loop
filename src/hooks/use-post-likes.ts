
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";

interface PostLikesProps {
  initialLikedPosts?: Record<number, boolean>;
  items: Array<{ id: number }>;
  userId: string | null;
  isAuthenticated: boolean;
}

export function usePostLikes({ initialLikedPosts = {}, items, userId, isAuthenticated }: PostLikesProps) {
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>(initialLikedPosts);
  const { toast } = useToast();

  // Fetch initial like status for each post
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!isAuthenticated || !userId) return;
      
      try {
        const postIds = items.map(item => String(item.id));
        
        // Get user's likes
        const { data: likes } = await supabase
          .from('likes')
          .select('listing_id')
          .eq('user_id', userId)
          .in('listing_id', postIds);
          
        if (likes) {
          const likedMap: Record<number, boolean> = {};
          likes.forEach(like => {
            likedMap[parseInt(like.listing_id)] = true;
          });
          setLikedPosts(likedMap);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };
    
    fetchLikeStatus();
  }, [items, userId, isAuthenticated]);

  const handleToggleLike = async (id: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if the user has already liked this post
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId)
        .eq('listing_id', String(id))
        .single();

      if (existingLike) {
        // Remove the like
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', String(id));

        // Update local state
        setLikedPosts(prev => ({
          ...prev,
          [id]: false
        }));
        
        toast({
          title: "Like removed",
          description: "You've removed your like from this post",
        });
      } else {
        // Add the like
        await supabase
          .from('likes')
          .insert([
            { user_id: userId, listing_id: String(id) }
          ]);

        // Update local state
        setLikedPosts(prev => ({
          ...prev,
          [id]: true
        }));
        
        toast({
          title: "Post liked",
          description: "You've liked this post",
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return {
    likedPosts,
    setLikedPosts,
    handleToggleLike
  };
}
