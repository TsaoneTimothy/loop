
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Seller {
  id: number;
  name: string;
  avatar: string;
}

interface Item {
  id: number;
  title: string;
  price: string;
  condition: string;
  location: string;
  category: string;
  image: string;
  seller: Seller;
}

interface FeaturedItemsProps {
  items: Item[];
  selectedCategory: string;
}

const FeaturedItems = ({ items, selectedCategory }: FeaturedItemsProps) => {
  // Filter items based on selected category
  const filteredItems = selectedCategory === "All" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <section className="mt-4 px-6 md:px-0">
      <h2 className="text-2xl font-bold mb-4">Featured Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-3">
              <Link to={`/profile/${item.seller.id}`} className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.seller.avatar} />
                  <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground hover:text-primary">
                  {item.seller.name}
                </span>
              </Link>
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
