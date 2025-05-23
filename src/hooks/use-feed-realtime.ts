
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseFeedRealtimeProps {
  userId: string | null;
  setLikedPosts: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  setPostStats: React.Dispatch<React.SetStateAction<Record<number, {likes: number, comments: number}>>>;
}

export function useFeedRealtime({ userId, setLikedPosts, setPostStats }: UseFeedRealtimeProps) {
  // Listen for realtime updates
  useEffect(() => {
    const likesChannel = supabase.channel('public:likes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'likes' 
      }, (payload) => {
        let listingId: number;
        
        // Type guard to check if payload.new or payload.old has listing_id
        const newListingId = payload.new ? (payload.new as any).listing_id : undefined;
        const oldListingId = payload.old ? (payload.old as any).listing_id : undefined;
        
        if (newListingId) {
          listingId = parseInt(newListingId);
        } else if (oldListingId) {
          listingId = parseInt(oldListingId);
        } else {
          return; // Skip if no valid listing_id
        }
        
        // Update like counts
        if (payload.eventType === 'INSERT') {
          // Someone liked a post
          setPostStats(prev => ({
            ...prev,
            [listingId]: {
              ...prev[listingId],
              likes: (prev[listingId]?.likes || 0) + 1
            }
          }));
          
          // If it's the current user, update their liked status
          if (payload.new && (payload.new as any).user_id === userId) {
            setLikedPosts(prev => ({
              ...prev,
              [listingId]: true
            }));
          }
        } else if (payload.eventType === 'DELETE') {
          // Someone removed a like
          setPostStats(prev => ({
            ...prev,
            [listingId]: {
              ...prev[listingId],
              likes: Math.max(0, (prev[listingId]?.likes || 1) - 1)
            }
          }));
          
          // If it's the current user, update their liked status
          if (payload.old && (payload.old as any).user_id === userId) {
            setLikedPosts(prev => ({
              ...prev,
              [listingId]: false
            }));
          }
        }
      })
      .subscribe();
      
    const commentsChannel = supabase.channel('public:comments')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'comments' 
      }, (payload) => {
        let listingId: number;
        
        // Type guard to check if payload.new or payload.old has listing_id
        const newListingId = payload.new ? (payload.new as any).listing_id : undefined;
        const oldListingId = payload.old ? (payload.old as any).listing_id : undefined;
        
        if (newListingId) {
          listingId = parseInt(newListingId);
        } else if (oldListingId) {
          listingId = parseInt(oldListingId);
        } else {
          return; // Skip if no valid listing_id
        }
        
        // Update comment counts
        if (payload.eventType === 'INSERT') {
          // Someone commented on a post
          setPostStats(prev => ({
            ...prev,
            [listingId]: {
              ...prev[listingId],
              comments: (prev[listingId]?.comments || 0) + 1
            }
          }));
        } else if (payload.eventType === 'DELETE') {
          // Someone deleted a comment
          setPostStats(prev => ({
            ...prev,
            [listingId]: {
              ...prev[listingId],
              comments: Math.max(0, (prev[listingId]?.comments || 1) - 1)
            }
          }));
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [userId, setLikedPosts, setPostStats]);
}
