
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Store, Tag, Newspaper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MyListingsProps {
  userId: string;
  isOwner: boolean;
}

interface Listing {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image: string;
  type: string;
  created_at: string;
}

const MyListings = ({ userId, isOwner }: MyListingsProps) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Fetch product listings
      const { data: productData, error: productError } = await supabase
        .from('listings')
        .select('id, title, description, price, images, post_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (productError) throw productError;

      // Fetch discount promotions
      const { data: discountData, error: discountError } = await supabase
        .from('discount_promotions')
        .select('id, title, description, price, images, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (discountError) throw discountError;

      // Fetch news/announcements
      const { data: newsData, error: newsError } = await supabase
        .from('news_announcements')
        .select('id, title, description, images, news_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (newsError) throw newsError;

      // Combine all items
      const allListings: Listing[] = [
        ...(productData || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image: item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
          type: item.post_type || 'product',
          created_at: item.created_at
        })),
        ...(discountData || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image: item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae',
          type: 'discount',
          created_at: item.created_at
        })),
        ...(newsData || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: undefined,
          image: item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
          type: item.news_type || 'news',
          created_at: item.created_at
        }))
      ];

      // Sort by creation date
      allListings.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setListings(allListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load listings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchListings();
    }
  }, [userId]);

  const handleDeleteListing = async (id: string, type: string) => {
    setDeletingItem(true);
    try {
      let tableName = 'listings';
      if (type === 'discount') {
        tableName = 'discount_promotions';
      } else if (type === 'news' || type === 'announcement') {
        tableName = 'news_announcements';
      }

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setListings(listings.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
      
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      });
    } finally {
      setDeletingItem(false);
    }
  };

  const getFilteredListings = () => {
    if (selectedTab === 'all') return listings;
    return listings.filter(item => item.type === selectedTab);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Store className="h-4 w-4" />;
      case 'discount':
        return <Tag className="h-4 w-4" />;
      case 'news':
      case 'announcement':
        return <Newspaper className="h-4 w-4" />;
      default:
        return <Store className="h-4 w-4" />;
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {isOwner ? 'My Listings' : 'Listings'}
        </h2>
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="discount">Discounts</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-0">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : getFilteredListings().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredListings().map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 flex items-center gap-1 w-fit">
                          {getTypeIcon(listing.type)}
                          <span className="capitalize">{listing.type}</span>
                        </Badge>
                        <h3 className="font-semibold text-lg">{listing.title}</h3>
                        {listing.price !== undefined && (
                          <p className="text-primary font-medium">₱{listing.price}</p>
                        )}
                        {listing.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {listing.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  {isOwner && (
                    <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setItemToDelete(listing.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No listings found</p>
              {isOwner && <p className="text-sm text-muted-foreground">Create your first listing!</p>}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirm Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogTitle>Delete Listing</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this listing? This action cannot be undone.
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deletingItem}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (itemToDelete) {
                  const item = listings.find(l => l.id === itemToDelete);
                  if (item) {
                    handleDeleteListing(itemToDelete, item.type);
                  }
                }
              }}
              disabled={deletingItem}
            >
              {deletingItem ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListings;
