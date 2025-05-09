
import { useState, useEffect } from "react";

// Import components
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import CategoryFilter from "@/components/marketplace/CategoryFilter";
import HotDealsSection from "@/components/marketplace/HotDealsSection";
import FeaturedItems from "@/components/marketplace/FeaturedItems";
import RecentListingsSection from "@/components/marketplace/RecentListingsSection";
import CreateListingButton from "@/components/marketplace/CreateListingButton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import mock data
import { categories, discounts as mockDiscounts } from "@/components/marketplace/data";

// Update the discount type to use string for id to match the database
interface Discount {
  id: string;
  title: string;
  store: string;
  expiresIn: string;
  image: string;
}

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts.map(d => ({...d, id: String(d.id)})));
  const { toast } = useToast();

  // Fetch product listings from supabase
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            id,
            title,
            description,
            created_at,
            images,
            price,
            location,
            category,
            post_type,
            user_id
          `)
          .eq('post_type', 'product')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching listings:", error);
          toast({
            title: 'Error fetching listings',
            description: 'Could not load product listings. Please try again later.',
            variant: 'destructive'
          });
          setFeaturedItems([]);
          setRecentListings([]);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          setFeaturedItems([]);
          setRecentListings([]);
          setLoading(false);
          return;
        }

        // Fetch all user profiles at once for better performance
        const userIds = [...new Set(data.map(item => item.user_id))];
        const { data: userProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);
          
        if (profileError) {
          console.error("Error fetching user profiles:", profileError);
        }
        
        // Create a map of user profiles for quick access
        const profileMap = new Map();
        if (userProfiles) {
          userProfiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }

        // Transform to featured items
        const items = data.map(item => {
          // Get the seller profile from the map
          const userProfile = profileMap.get(item.user_id) || { id: item.user_id, full_name: 'Unknown User', avatar_url: null };
          
          return {
            id: item.id,
            title: item.title,
            price: `₱${item.price}`,
            condition: item.category || 'Used',
            location: item.location,
            category: item.category || 'Other',
            image: item.images && item.images.length > 0 
              ? item.images[0] 
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            seller: {
              id: userProfile.id,
              name: userProfile.full_name || 'Unknown User',
              avatar: userProfile.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
            },
            description: item.description
          };
        });

        // Split to featured and recent
        setFeaturedItems(items.slice(0, 8));
        setRecentListings(items.slice(0, 4)); // Just get the first 4 for recent listings

      } catch (error) {
        console.error('Error fetching listings:', error);
        toast({
          title: 'Error fetching listings',
          description: 'Could not load product listings. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [toast]);

  // Fetch discounts
  useEffect(() => {
    async function fetchDiscounts() {
      try {
        const { data, error } = await supabase
          .from('discount_promotions')
          .select(`
            id,
            title,
            store,
            location,
            expires_at,
            images,
            user_id
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error("Error fetching discounts:", error);
          return;
        }

        if (data && data.length > 0) {
          // Fetch all user profiles at once for better performance
          const userIds = [...new Set(data.map(item => item.user_id))];
          const { data: userProfiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);
            
          if (profileError) {
            console.error("Error fetching user profiles:", profileError);
          }
          
          // Create a map of user profiles for quick access
          const profileMap = new Map();
          if (userProfiles) {
            userProfiles.forEach(profile => {
              profileMap.set(profile.id, profile);
            });
          }
          
          const transformedDiscounts: Discount[] = data.map(item => ({
            id: item.id,
            title: item.title,
            store: item.store || 'Campus Store',
            expiresIn: item.expires_at 
              ? new Date(item.expires_at) > new Date() 
                ? `${Math.ceil((new Date(item.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` 
                : 'Expired'
              : 'Limited time',
            image: item.images && item.images.length > 0 
              ? item.images[0] 
              : 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae'
          }));
          
          setDiscounts(transformedDiscounts);
        }
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    }

    fetchDiscounts();
  }, []);

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
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <FeaturedItems 
              items={featuredItems} 
              selectedCategory={selectedCategory}
            />
          )}
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
