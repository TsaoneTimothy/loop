
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecentItem {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
}

interface RecentListingsSectionProps {
  recentListings: RecentItem[];
}

const RecentListingsSection = ({ recentListings }: RecentListingsSectionProps) => {
  return (
    <section className="mt-6 px-6 md:px-0 md:mt-4">
      <h2 className="text-2xl font-bold mb-4">Recent Listings</h2>
      <div className="space-y-4">
        {recentListings.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-3">
              <div className="flex gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-primary font-bold">{item.price}</p>
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Looking for something?</h3>
            <p className="text-sm mb-4">Post a request and let others help you find what you need.</p>
            <Button className="w-full">Post a Request</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RecentListingsSection;
