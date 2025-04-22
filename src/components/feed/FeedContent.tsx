
import React from "react";
import PostItem from "./PostItem";
import { FeedItem } from "@/types/feed";

interface FeedContentProps {
  items: FeedItem[];
  toggleSaved: (id: number) => void;
}

const FeedContent = ({ items, toggleSaved }: FeedContentProps) => {
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
            saved={item.saved}
            user={item.user}
            onToggleSaved={toggleSaved}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedContent;
