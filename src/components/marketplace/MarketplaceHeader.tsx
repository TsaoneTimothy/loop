
import Logo from "@/components/shared/Logo";
import SearchBar from "./SearchBar";
import ActionButtons from "./ActionButtons";

interface MarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MarketplaceHeader = ({ searchQuery, setSearchQuery }: MarketplaceHeaderProps) => {
  return (
    <header className="loop-header md:flex md:justify-between md:items-center md:px-8 md:py-6">
      <div className="hidden md:block">
        <Logo size="medium" />
      </div>
      <div className="flex items-center gap-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ActionButtons />
      </div>
    </header>
  );
};

export default MarketplaceHeader;
