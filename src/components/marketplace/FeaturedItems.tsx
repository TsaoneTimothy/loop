
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-48 object-cover rounded-md mb-3" 
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{item.title}</DialogTitle>
                <DialogDescription>{item.description}</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full max-h-[500px] object-contain rounded-md" 
                />
              </div>
              <div className="mt-4 flex flex-col space-y-2">
                <p><span className="font-medium">Price:</span> {item.price}</p>
                <p><span className="font-medium">Condition:</span> {item.condition}</p>
                <p><span className="font-medium">Location:</span> {item.location}</p>
              </div>
            </DialogContent>
          </Dialog>

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
          
          {/* Seller information */}
          <div className="mt-3 pt-3 border-t border-border flex items-center">
            <Link to={`/profile/${item.seller.id}`} className="flex items-center">
              <Avatar className="h-7 w-7 mr-2">
                <img src={item.seller.avatar} alt={item.seller.name} />
              </Avatar>
              <span className="text-sm font-medium hover:underline">{item.seller.name}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedItems;
