
import React from "react";
import FeedCategorySelector from "@/components/feed/FeedCategorySelector";
import { FeedItem } from "@/types/feed";

interface FeedFilterProps {
  items: FeedItem[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const FeedFilter: React.FC<FeedFilterProps> = ({ 
  items,
  selectedCategory,
  setSelectedCategory
}) => {
  // Filter items based on selected category
  const filteredItems = selectedCategory
    ? items.filter((item) => item.type === selectedCategory)
    : items;
  
  return (
    <div>
      <FeedCategorySelector 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {filteredItems.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No posts found</p>
          <p className="text-sm text-muted-foreground">Be the first to post something!</p>
        </div>
      )}
    </div>
  );
};

export default FeedFilter;
