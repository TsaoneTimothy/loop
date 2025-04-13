
import { useState } from "react";

// Import components
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import CategoryFilter from "@/components/marketplace/CategoryFilter";
import HotDealsSection from "@/components/marketplace/HotDealsSection";
import FeaturedItems from "@/components/marketplace/FeaturedItems";
import RecentListingsSection from "@/components/marketplace/RecentListingsSection";
import CreateListingButton from "@/components/marketplace/CreateListingButton";

// Import mock data
import { 
  categories, 
  discounts, 
  featuredItems, 
  recentListings 
} from "@/components/marketplace/data";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pb-20 md:pb-10">
      <MarketplaceHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      
      <HotDealsSection discounts={discounts} />
      
      <div className="md:grid md:grid-cols-12 md:gap-6 md:px-8 md:py-6">
        <div className="md:col-span-8">
          <FeaturedItems items={featuredItems} />
        </div>
        
        <div className="md:col-span-4">
          <RecentListingsSection recentListings={recentListings} />
        </div>
      </div>
      
      <CreateListingButton />
    </div>
  );
};

export default Marketplace;
