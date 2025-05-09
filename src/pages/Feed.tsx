
import { useState, useEffect } from "react";
import FeedHeader from "@/components/feed/FeedHeader";
import FeedCategorySelector from "@/components/feed/FeedCategorySelector";
import FeedContent from "@/components/feed/FeedContent";
import FloatingThemeToggle from "@/components/feed/FloatingThemeToggle";
import { FeedItem } from "@/types/feed";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";

const Feed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const { userId } = useProfile();

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
            user_id
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
            user_id
          `)
          .order('created_at', { ascending: false });

        if (newsError) {
          console.error("Error fetching news/announcements:", newsError);
        }

        // Fetch all user profiles for more efficient lookup
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url');
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }
        
        // Create a map of user profiles for quick lookup
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Helper function to get user data
        const getUserData = (userId: string) => {
          const profile = profileMap.get(userId);
          return {
            id: parseInt(userId) || 0,
            name: profile?.full_name || 'Unknown User',
            username: (profile?.full_name || 'unknown').toLowerCase().replace(/\s/g, ''),
            avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
            role: 'user',
            verified: false
          };
        };
        
        // Map discount promotions to feed items
        let discountItems: FeedItem[] = [];
        if (discountData && discountData.length > 0) {
          discountItems = discountData.map(item => {
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
              user: getUserData(item.user_id),
              link: `/marketplace/discount/${item.id}`,
              expiresAt: item.expires_at ? new Date(item.expires_at).toLocaleDateString() : undefined
            };
          });
        }
        
        // Map news/announcements to feed items
        let newsItems: FeedItem[] = [];
        if (newsData && newsData.length > 0) {
          newsItems = newsData.map(item => {
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
              user: getUserData(item.user_id)
            };
          });
        }
        
        // Combine all items
        let feedItems: FeedItem[] = [...discountItems, ...newsItems];
        
        // Sort all items by date (newest first)
        feedItems.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        // If user is logged in, fetch their bookmarks
        if (userId) {
          try {
            const { data: bookmarks } = await supabase
              .from('bookmarks')
              .select('listing_id')
              .eq('user_id', userId);
              
            if (bookmarks && bookmarks.length > 0) {
              // Create a set of bookmarked listing IDs
              const bookmarkedIds = new Set(
                bookmarks.map(bookmark => parseInt(bookmark.listing_id))
              );
              
              // Mark bookmarked items
              feedItems = feedItems.map(item => ({
                ...item,
                saved: bookmarkedIds.has(item.id)
              }));
            }
          } catch (error) {
            console.error('Error fetching bookmarks:', error);
          }
        }

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
  }, [toast, userId]);

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
