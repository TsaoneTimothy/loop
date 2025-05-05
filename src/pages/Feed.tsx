
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
        // Check if post_type column exists
        const { error: checkError } = await supabase
          .from('listings')
          .select('post_type')
          .limit(1)
          .maybeSingle();

        if (checkError && checkError.message.includes("post_type")) {
          // If post_type column doesn't exist yet, show an empty feed
          console.error("post_type column doesn't exist yet:", checkError);
          setItems([]);
          setLoading(false);
          return;
        }

        const { data: listingsData, error: listingsError } = await supabase
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
            expires_at,
            user_id,
            profiles:user_id (
              id,
              full_name,
              avatar_url
            )
          `)
          .in('post_type', ['news', 'discount'])
          .order('created_at', { ascending: false });

        if (listingsError) {
          throw listingsError;
        }

        if (!listingsData) {
          setItems([]);
          setLoading(false);
          return;
        }

        // Transform the listings data into FeedItems
        const feedItems: FeedItem[] = listingsData.map(item => {
          const user = item.profiles || {};
          
          return {
            id: parseInt(item.id),
            type: item.post_type,
            title: item.title,
            description: item.description || '',
            date: new Date(item.created_at).toLocaleDateString(),
            image: item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
            orientation: 'landscape',
            likes: 0,
            comments: 0,
            saved: false,
            user: {
              id: parseInt(user.id || '0'),
              name: user.full_name || 'Anonymous',
              username: user.full_name?.toLowerCase().replace(/\s/g, '') || 'anonymous',
              avatar: user.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
              role: item.post_type === 'discount' ? 'merchant' : 'student',
              verified: false
            },
            link: item.post_type === 'discount' ? `/marketplace/discount/${item.id}` : undefined,
            expiresAt: item.expires_at ? new Date(item.expires_at).toLocaleDateString() : undefined
          };
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
    // In a real app, this would save to the database
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
