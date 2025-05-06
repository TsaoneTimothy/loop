import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface FeaturedItemsProps {
  items: any[];
  selectedCategory: string;
}

const FeaturedItems = ({ items, selectedCategory }: FeaturedItemsProps) => {
  const filteredItems = selectedCategory === "All" ? items : items.filter(item => item.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredItems.map(item => (
        <div key={item.id} className="loop-card">
          <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-md mb-3" />
          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary font-medium">{item.price}</span>
              <p className="text-muted-foreground text-xs">Condition: {item.condition}</p>
              <p className="text-muted-foreground text-xs">Location: {item.location}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Link to={`/messages?seller=${item.seller.id}`}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message Seller
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedItems;
