
import React from "react";
import PostItem from "./PostItem";
import { FeedItem } from "@/types/feed";
import { useProfile } from "@/hooks/use-profile";
import { usePostLikes } from "@/hooks/use-post-likes";
import { usePostStats } from "@/hooks/use-post-stats";
import { usePostComments } from "@/hooks/use-post-comments";
import { usePostBookmarks } from "@/hooks/use-post-bookmarks";
import { useFeedRealtime } from "@/hooks/use-feed-realtime";

interface FeedContentProps {
  items: FeedItem[];
  toggleSaved: (id: number) => void;
}

const FeedContent = ({ items, toggleSaved }: FeedContentProps) => {
  const { isAuthenticated, userId } = useProfile();
  
  // Use our custom hooks
  const { postStats, setPostStats } = usePostStats({ items });
  const { likedPosts, setLikedPosts, handleToggleLike } = usePostLikes({ 
    items, 
    userId, 
    isAuthenticated 
  });
  const { handleAddComment } = usePostComments();
  const { handleBookmark } = usePostBookmarks(toggleSaved);
  
  // Set up realtime updates
  useFeedRealtime({ 
    userId, 
    setLikedPosts, 
    setPostStats 
  });

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
