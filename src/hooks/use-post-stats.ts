
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeedItem } from "@/types/feed";

interface UsePostStatsProps {
  items: FeedItem[];
}

export function usePostStats({ items }: UsePostStatsProps) {
  const [postStats, setPostStats] = useState<Record<number, {likes: number, comments: number}>>({});
  
  // Fetch initial stats for posts
  useEffect(() => {
    const fetchPostStats = async () => {
      try {
        const postIds = items.map(item => String(item.id));
        
        // Get like counts and comment counts for each post
        const statsMap: Record<number, {likes: number, comments: number}> = {};
        
        // Fetch like counts
        for (const postId of postIds) {
          const { count: likeCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('listing_id', postId);
            
          const { count: commentCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('listing_id', postId);
            
          statsMap[parseInt(postId)] = {
            likes: likeCount || 0,
            comments: commentCount || 0
          };
        }
        
        setPostStats(statsMap);
      } catch (error) {
        console.error("Error fetching post stats:", error);
      }
    };
    
    fetchPostStats();
  }, [items]);

  return {
    postStats,
    setPostStats
  };
}
