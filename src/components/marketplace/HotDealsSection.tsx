
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

// Update the discount interface to use string for id
interface Discount {
  id: string;
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
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Hot Deals</h2>
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </div>
        <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1">
          See all <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {discounts.map((discount) => (
            <Card 
              key={discount.id} 
              className="min-w-[260px] hover:shadow-md transition-shadow border-0 overflow-hidden relative group"
              style={{
                backgroundImage: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              {/* Overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 group-hover:opacity-70 transition-opacity"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="h-32 relative overflow-hidden rounded-t-lg">
                <img 
                  src={discount.image} 
                  alt={discount.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-white font-bold text-xl">{discount.title}</h3>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform rotate-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    HOT DEAL
                  </span>
                </div>
              </div>
              <CardContent className="p-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-purple-700 dark:text-purple-300">{discount.store}</span>
                  <Badge variant="outline" className="text-xs bg-purple-200 text-purple-700 border-purple-300 dark:bg-purple-800/50 dark:text-purple-300 dark:border-purple-600">
                    Expires in {discount.expiresIn}
                  </Badge>
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
