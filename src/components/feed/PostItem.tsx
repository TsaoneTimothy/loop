
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { PostItemProps } from "@/types/post";
import { usePostCommentsState } from "@/hooks/use-post-comments-state";

// Import our new component files
import PostHeader from "./post/PostHeader";
import PostBadge from "./post/PostBadge";
import PostBody from "./post/PostBody";
import PostFooter from "./post/PostFooter";
import PostComments from "./post/PostComments";

const PostItem = ({ 
  id, 
  type, 
  title, 
  description, 
  date, 
  image, 
  orientation, 
  likes: initialLikes, 
  comments: initialComments, 
  saved, 
  liked = false,
  user, 
  onToggleSaved,
  onToggleLike,
  onAddComment,
  link,
  expiresAt
}: PostItemProps) => {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [isLiked, setIsLiked] = useState(liked);
  const [isSaved, setIsSaved] = useState(saved);
  const { profile } = useProfile();
  const { toast } = useToast();
  const { commentsList, showComments, setShowComments } = usePostCommentsState(id);

  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);
  
  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);
  
  useEffect(() => {
    // Listen for changes to likes in real-time
    const likesChannel = supabase
      .channel('public:likes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'likes',
          filter: `listing_id=eq.${id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // A new like was added
            if (profile?.id === payload.new.user_id) {
              setIsLiked(true);
            }
            setLikesCount(prev => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            // A like was removed
            if (profile?.id === payload.old.user_id) {
              setIsLiked(false);
            }
            setLikesCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();
      
    // Listen for changes to bookmarks in real-time
    const bookmarksChannel = supabase
      .channel('public:bookmarks')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks',
          filter: `listing_id=eq.${id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // A new bookmark was added
            if (profile?.id === payload.new.user_id) {
              setIsSaved(true);
            }
          } else if (payload.eventType === 'DELETE') {
            // A bookmark was removed
            if (profile?.id === payload.old.user_id) {
              setIsSaved(false);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(bookmarksChannel);
    };
  }, [id, profile?.id]);

  const handleToggleLike = async () => {
    if (onToggleLike) {
      try {
        await onToggleLike(id);
        // We don't need to update state here as the real-time subscription will handle it
      } catch (error) {
        console.error("Error toggling like:", error);
        toast({
          title: "Error",
          description: "Failed to update like status",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleToggleSaved = () => {
    onToggleSaved(id);
    // We don't need to update state here as the real-time subscription will handle it
  };

  const handleAddComment = async (comment: string) => {
    if (!onAddComment) return false;
    return await onAddComment(comment);
  };

  const isDiscount = type === "discount" || type === "coupon";
  
  return (
    <div className={`loop-card overflow-hidden ${isDiscount ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/30 border-2 border-purple-300 dark:border-purple-700' : ''}`}>
      {/* User Profile Header */}
      <PostHeader 
        user={user} 
        isSaved={isSaved} 
        onToggleSaved={handleToggleSaved} 
      />
      
      {/* Badge for post type */}
      <PostBadge 
        type={type} 
        date={date} 
        isDiscount={isDiscount}
      />
      
      {/* Post Body */}
      <PostBody 
        title={title} 
        description={description} 
        image={image} 
        orientation={orientation}
        link={link} 
        expiresAt={expiresAt}
        isDiscount={isDiscount}
        type={type}
      />
      
      {/* Card Footer */}
      <PostFooter 
        likesCount={likesCount} 
        commentsCount={commentsCount}
        isLiked={isLiked}
        onToggleLike={handleToggleLike}
        onToggleComments={() => setShowComments(!showComments)}
      />

      {/* Comments Section */}
      {showComments && (
        <PostComments 
          comments={commentsList}
          userAvatar={profile?.avatar_url || ''}
          userName={profile?.full_name || 'You'}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default PostItem;
