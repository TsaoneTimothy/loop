
import { Home, MessageCircle, User, Store } from "lucide-react";
import NavigationItem from "./navigation/NavigationItem";
import CreateListingButton from "./navigation/CreateListingButton";
import UnreadMessageBadge from "./messages/UnreadMessageBadge";

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 max-w-none mx-auto">
      <div className="flex justify-around items-center">
        <NavigationItem 
          to="/feed" 
          icon={Home} 
          label="Feed" 
        />
        
        <NavigationItem 
          to="/marketplace" 
          icon={Store} 
          label="Marketplace" 
        />
        
        <CreateListingButton />
        
        <NavigationItem 
          to="/messages" 
          icon={MessageCircle} 
          label="Messages" 
          showBadge={true} 
          badgeComponent={<UnreadMessageBadge />}
        />
        
        <NavigationItem 
          to="/profile" 
          icon={User} 
          label="Profile" 
        />
      </div>
    </nav>
  );
};

export default Navigation;
