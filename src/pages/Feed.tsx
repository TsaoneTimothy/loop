
import { useState } from "react";
import FeedHeader from "@/components/feed/FeedHeader";
import FeedCategorySelector from "@/components/feed/FeedCategorySelector";
import FeedContent from "@/components/feed/FeedContent";
import FloatingThemeToggle from "@/components/feed/FloatingThemeToggle";
import { feedItems as initialFeedItems } from "@/data/feedData";
import { FeedItem } from "@/types/feed";

const Feed = () => {
  const [items, setItems] = useState<FeedItem[]>(initialFeedItems);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Toggle saved status
  const toggleSaved = (id: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, saved: !item.saved };
        }
        return item;
      })
    );
  };

  // Filter items based on selected category
  const filteredItems = selectedCategory
    ? items.filter((item) => 
        selectedCategory === "events" 
          ? item.type === "event" 
          : item.type === selectedCategory
      )
    : items;

  return (
    <div className="pb-20 md:px-10 relative">
      {/* Floating Theme Toggle Button */}
      <FloatingThemeToggle />
      
      {/* Header */}
      <FeedHeader />
      
      <section className="mt-4 px-4 md:px-6">
        {/* Category Selector */}
        <FeedCategorySelector 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        {/* Feed Content */}
        <FeedContent items={filteredItems} toggleSaved={toggleSaved} />
      </section>
    </div>
  );
};

export default Feed;
