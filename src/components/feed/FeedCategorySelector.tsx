
import React from "react";
import { Store, Calendar, Newspaper } from "lucide-react";

// Categories for the feed
const feedCategories = [
  { id: "store", name: "Campus Store", icon: <Store className="h-6 w-6" /> },
  { id: "events", name: "Events", icon: <Calendar className="h-6 w-6" /> },
  { id: "news", name: "News", icon: <Newspaper className="h-6 w-6" /> }
];

interface FeedCategorySelectorProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const FeedCategorySelector = ({ 
  selectedCategory, 
  setSelectedCategory 
}: FeedCategorySelectorProps) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex gap-8">
        {feedCategories.map((category) => (
          <button
            key={category.id}
            className={`flex flex-col items-center gap-2 ${
              selectedCategory === category.id ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => 
              setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )
            }
          >
            <div className={`rounded-full p-3 bg-card border ${
              selectedCategory === category.id ? "border-primary" : "border-border"
            }`}>
              {category.icon}
            </div>
            <span className="text-sm">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedCategorySelector;
