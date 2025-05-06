
import { useState, useEffect } from "react";
import FeedHeader from "@/components/feed/FeedHeader";
import FeedCategorySelector from "@/components/feed/FeedCategorySelector";
import FeedContent from "@/components/feed/FeedContent";
import FloatingThemeToggle from "@/components/feed/FloatingThemeToggle";
import { FeedItem } from "@/types/feed";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Feed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch feed items from supabase
  useEffect(() => {
    async function fetchFeedItems() {
      setLoading(true);
      try {
        // Fetch discount promotions
        const { data: discountData, error: discountError } = await supabase
          .from('discount_promotions')
          .select(`
            id,
            title,
            description,
            created_at,
            images,
            price,
            location,
            store,
            expires_at,
            user_id,
            profiles:user_id (id, full_name, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (discountError) {
          console.error("Error fetching discount promotions:", discountError);
        }

        // Fetch news/announcements
        const { data: newsData, error: newsError } = await supabase
          .from('news_announcements')
          .select(`
            id,
            title,
            description,
            created_at,
            images,
            location,
            news_type,
            user_id,
            profiles:user_id (id, full_name, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (newsError) {
          console.error("Error fetching news/announcements:", newsError);
        }

        // Combine and transform the data
        let feedItems: FeedItem[] = [];

        // Transform discount promotions to FeedItems
        if (discountData && discountData.length > 0) {
          const discountItems = discountData.map(item => {
            // Safely handle potentially undefined profile data
            const userProfile = item.profiles || { id: '0', full_name: 'Anonymous', avatar_url: null };
            
            return {
              id: parseInt(item.id) || 0,
              type: 'discount',
              title: item.title || '',
              description: item.description || '',
              date: new Date(item.created_at || '').toLocaleDateString(),
              image: item.images && item.images.length > 0 
                ? item.images[0] 
                : 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae',
              orientation: 'landscape',
              likes: 0,
              comments: 0,
              saved: false,
              user: {
                id: parseInt(userProfile.id as string) || 0,
                name: userProfile.full_name as string || 'Anonymous',
                username: (userProfile.full_name as string || 'anonymous').toLowerCase().replace(/\s/g, ''),
                avatar: userProfile.avatar_url as string || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
                role: 'merchant',
                verified: false
              },
              link: `/marketplace/discount/${item.id}`,
              expiresAt: item.expires_at ? new Date(item.expires_at).toLocaleDateString() : undefined
            };
          });
          
          feedItems = [...feedItems, ...discountItems];
        }
        
        // Transform news announcements to FeedItems
        if (newsData && newsData.length > 0) {
          const newsItems = newsData.map(item => {
            // Safely handle potentially undefined profile data
            const userProfile = item.profiles || { id: '0', full_name: 'Anonymous', avatar_url: null };
            
            return {
              id: parseInt(item.id) || 0,
              type: item.news_type || 'news',
              title: item.title || '',
              description: item.description || '',
              date: new Date(item.created_at || '').toLocaleDateString(),
              image: item.images && item.images.length > 0 
                ? item.images[0] 
                : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
              orientation: 'landscape',
              likes: 0,
              comments: 0,
              saved: false,
              user: {
                id: parseInt(userProfile.id as string) || 0,
                name: userProfile.full_name as string || 'Anonymous',
                username: (userProfile.full_name as string || 'anonymous').toLowerCase().replace(/\s/g, ''),
                avatar: userProfile.avatar_url as string || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
                role: 'student',
                verified: false
              }
            };
          });
          
          feedItems = [...feedItems, ...newsItems];
        }
        
        // Sort all items by date (newest first)
        feedItems.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setItems(feedItems);
      } catch (error) {
        console.error('Error fetching feed items:', error);
        toast({
          title: 'Error fetching feed',
          description: 'Could not load feed items. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFeedItems();
  }, [toast]);

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
        <FeedCategorySelector 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        {/* Feed Content */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          filteredItems.length > 0 ? (
            <FeedContent items={filteredItems} toggleSaved={toggleSaved} />
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No posts found</p>
              <p className="text-sm text-muted-foreground">Be the first to post something!</p>
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default Feed;
