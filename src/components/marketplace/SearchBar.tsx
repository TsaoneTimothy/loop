
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
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
  );
};

export default SearchBar;
