
import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { FeedItem } from "@/types/feed";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";

interface FeedContentProps {
  items: FeedItem[];
  toggleSaved: (id: number) => void;
}

const FeedContent = ({ items, toggleSaved }: FeedContentProps) => {
  const { toast } = useToast();
  const { isAuthenticated, userId } = useProfile();
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [postStats, setPostStats] = useState<Record<number, {likes: number, comments: number}>>({});
  
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
        
        setPostStats(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            likes: Math.max(0, (prev[id]?.likes || 1) - 1)
          }
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
        
        setPostStats(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            likes: (prev[id]?.likes || 0) + 1
          }
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
      
      // Update local state
      setPostStats(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          comments: (prev[id]?.comments || 0) + 1
        }
      }));
      
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

        // We still need to call toggleSaved to update the parent component's state
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

        // We still need to call toggleSaved to update the parent component's state
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

  // Listen for realtime updates
  useEffect(() => {
    const likesChannel = supabase.channel('public:likes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'likes' 
      }, (payload) => {
        const listingId = parseInt(payload.new?.listing_id || payload.old?.listing_id);
        if (!listingId) return;
        
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
          if (payload.new.user_id === userId) {
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
          if (payload.old.user_id === userId) {
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
        const listingId = parseInt(payload.new?.listing_id || payload.old?.listing_id);
        if (!listingId) return;
        
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
  }, [userId]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {items.map((item) => (
          <PostItem 
            key={item.id}
            id={item.id}
            type={item.type}
            title={item.title}
            description={item.description}
            date={item.date}
            image={item.image}
            orientation={item.orientation}
            likes={postStats[item.id]?.likes ?? item.likes}
            comments={postStats[item.id]?.comments ?? item.comments}
            saved={item.saved}
            user={item.user}
            onToggleSaved={() => handleBookmark(item.id)}
            onToggleLike={() => handleToggleLike(item.id)}
            onAddComment={(comment) => handleAddComment(item.id, comment)}
            link={item.link}
            expiresAt={item.expiresAt}
            liked={likedPosts[item.id] || false}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedContent;
