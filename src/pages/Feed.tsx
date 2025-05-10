
import { useState } from "react";
import FeedHeader from "@/components/feed/FeedHeader";
import FloatingThemeToggle from "@/components/feed/FloatingThemeToggle";
import FeedContent from "@/components/feed/FeedContent";
import FeedFilter from "@/components/feed/FeedFilter";
import FeedLoading from "@/components/feed/FeedLoading";
import NewPostDialog from "@/components/feed/post/NewPostDialog";
import { useFeedItems } from "@/hooks/use-feed-items";
import { useProfile } from "@/hooks/use-profile";

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { userId } = useProfile();
  const { items, loading, toggleSaved, refreshItems } = useFeedItems(userId);

  // Filter items based on selected category
  const filteredItems = selectedCategory
    ? items.filter((item) => item.type === selectedCategory)
    : items;

  return (
    <div className="pb-20 md:px-10 relative">
      {/* Floating Theme Toggle Button */}
      <FloatingThemeToggle />
      
      {/* Header */}
      <FeedHeader />
      
      <section className="mt-4 px-4 md:px-6">
        {/* Category Selector */}
        <FeedFilter 
          items={items}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        {/* Feed Content */}
        {loading ? (
          <FeedLoading />
        ) : (
          filteredItems.length > 0 && (
            <FeedContent items={filteredItems} toggleSaved={toggleSaved} />
          )
        )}
      </section>

      {/* New Post Button & Dialog */}
      <NewPostDialog onSuccess={refreshItems} />
    </div>
  );
};

export default Feed;
