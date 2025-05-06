
import React, { useState } from "react";
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
  const [interactedItems, setInteractedItems] = useState<Record<string, boolean>>({});

  const handleToggleLike = async (id: number, type: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      // Determine the table name based on post type
      let tableName = "";
      if (type === "discount") {
        tableName = "discount_promotions";
      } else if (type === "news" || type === "announcement") {
        tableName = "news_announcements";
      } else {
        tableName = "listings";
      }

      // Check if the user has already liked this post
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId)
        .eq('listing_id', id)
        .single();

      if (existingLike) {
        // Remove the like
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', id);

        setInteractedItems(prev => ({ ...prev, [`like-${id}`]: false }));
        
        toast({
          title: "Like removed",
          description: "You've removed your like from this post",
        });
      } else {
        // Add the like
        await supabase
          .from('likes')
          .insert([
            { user_id: userId, listing_id: id }
          ]);

        setInteractedItems(prev => ({ ...prev, [`like-${id}`]: true }));
        
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

  const handleBookmark = async (id: number, type: string) => {
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
        .eq('listing_id', id)
        .single();

      if (existingBookmark) {
        // Remove the bookmark
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', id);

        setInteractedItems(prev => ({ ...prev, [`bookmark-${id}`]: false }));
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
            { user_id: userId, listing_id: id }
          ]);

        setInteractedItems(prev => ({ ...prev, [`bookmark-${id}`]: true }));
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

  const handleAddComment = async (id: number, comment: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase
        .from('comments')
        .insert([
          { 
            user_id: userId, 
            listing_id: id,
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
            likes={item.likes}
            comments={item.comments}
            saved={item.saved || interactedItems[`bookmark-${item.id}`] || false}
            user={item.user}
            onToggleSaved={() => handleBookmark(item.id, item.type)}
            onToggleLike={() => handleToggleLike(item.id, item.type)}
            onAddComment={(comment) => handleAddComment(item.id, comment)}
            link={item.link}
            expiresAt={item.expiresAt}
            liked={interactedItems[`like-${item.id}`] || false}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedContent;
