
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Discount {
  id: number;
  title: string;
  store: string;
  expiresIn: string;
  image: string;
}

interface HotDealsSectionProps {
  discounts: Discount[];
}

const HotDealsSection = ({ discounts }: HotDealsSectionProps) => {
  return (
    <section className="mt-4 px-6 md:px-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Hot Deals</h2>
        <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1">
          See all <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {discounts.map((discount) => (
            <Card key={discount.id} className="min-w-[260px] hover:shadow-md transition-shadow">
              <div className="h-32 relative overflow-hidden rounded-t-lg">
                <img 
                  src={discount.image} 
                  alt={discount.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-white font-bold text-xl">{discount.title}</h3>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{discount.store}</span>
                  <Badge variant="outline" className="text-xs">Expires in {discount.expiresIn}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};

export default HotDealsSection;
