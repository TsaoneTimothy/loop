import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface MyListingsProps {
  userId: string | undefined;
  isOwner: boolean;
}

const MyListings = (props: MyListingsProps) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      if (!props.userId) return;

      setLoading(true);
      try {
        const { data: listingData } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', props.userId);

        if (listingData) {
          setListings(listingData);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [props.userId]);

  return (
    <div>
      {loading ? (
        <p>Loading listings...</p>
      ) : listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
                <CardDescription>{listing.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Price: {listing.price}</p>
                <p>Location: {listing.location}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to={`/marketplace/item/${listing.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                {props.isOwner && (
                  <Button>Edit</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
