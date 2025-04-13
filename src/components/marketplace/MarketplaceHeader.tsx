
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Filter } from "lucide-react";

interface MarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MarketplaceHeader = ({ searchQuery, setSearchQuery }: MarketplaceHeaderProps) => {
  return (
    <header className="loop-header md:flex md:justify-between md:items-center md:px-8 md:py-6">
      <h1 className="loop-title">Marketplace</h1>
      <div className="flex items-center gap-4">
        <div className="loop-search md:w-[400px]">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search items..." 
            className="border-0 bg-transparent focus-visible:ring-0 pl-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="bg-secondary rounded-full h-10 w-10">
          <Filter className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ShoppingBag className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
