
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: number;
  title: string;
  price: string;
  condition: string;
  location: string;
  category: string;
  image: string;
}

interface FeaturedItemsProps {
  items: Item[];
}

const FeaturedItems = ({ items }: FeaturedItemsProps) => {
  return (
    <section className="mt-4 px-6 md:px-0">
      <h2 className="text-2xl font-bold mb-4">Featured Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm truncate">{item.title}</h3>
              <div className="flex justify-between items-center mt-1">
                <p className="text-primary font-bold">{item.price}</p>
                <Badge variant="secondary" className="text-xs">{item.condition}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{item.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedItems;
