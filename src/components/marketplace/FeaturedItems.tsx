
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductDetailDialog from "./ProductDetailDialog";
import { useProfile } from "@/hooks/use-profile";
import { useNavigate } from "react-router-dom";

interface FeaturedItemsProps {
  items: any[];
  selectedCategory: string;
}

const FeaturedItems = ({ items, selectedCategory }: FeaturedItemsProps) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const filteredItems = selectedCategory === "All" ? items : items.filter(item => item.category === selectedCategory);
  const { isAuthenticated } = useProfile();
  const navigate = useNavigate();

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleMessageSeller = (sellerId: string) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/messages');
      return;
    }
    navigate(`/messages?seller=${sellerId}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className={`loop-card relative ${item.isDiscount ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/30 border-2 border-purple-300 dark:border-purple-700' : ''}`}
          >
            <div 
              className="cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover rounded-md mb-3" 
              />
            </div>

            {item.isDiscount && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform rotate-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  DISCOUNT
                </span>
              </div>
            )}

            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <span className={`font-medium ${item.isDiscount ? 'text-purple-600 dark:text-purple-400' : 'text-primary'}`}>
                  {item.price}
                </span>
                <p className="text-muted-foreground text-xs">Condition: {item.condition}</p>
                <p className="text-muted-foreground text-xs">Location: {item.location}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessageSeller(item.seller.id);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message Seller
                </Button>
              </div>
            </div>
            
            {/* Seller information */}
            <div className="mt-3 pt-3 border-t border-border flex items-center">
              <Link to={`/profile/${item.seller.id}`} className="flex items-center">
                <Avatar className="h-7 w-7 mr-2">
                  <AvatarImage src={item.seller.avatar} alt={item.seller.name} />
                  <AvatarFallback>{item.seller.name ? item.seller.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hover:underline">
                  {item.seller.name || 'User'}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Product detail dialog */}
      <ProductDetailDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        item={selectedItem}
      />
    </>
  );
};

export default FeaturedItems;
