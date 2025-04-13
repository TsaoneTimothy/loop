
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory 
}: CategoryFilterProps) => {
  return (
    <section className="px-6 md:px-8 overflow-x-auto py-4 border-b border-border">
      <div className="flex gap-2 pb-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "secondary"}
            className="rounded-full px-4 py-2 whitespace-nowrap"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;
