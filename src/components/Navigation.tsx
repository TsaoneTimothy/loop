
import { NavLink } from "react-router-dom";
import { Home, MessageCircle, User, Store, Plus } from "lucide-react";
import UnreadMessageBadge from "./messages/UnreadMessageBadge";

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 max-w-none mx-auto">
      <div className="flex justify-around items-center">
        <NavLink to="/feed" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home className="h-6 w-6" />
          <span>Feed</span>
        </NavLink>
        
        <NavLink to="/marketplace" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Store className="h-6 w-6" />
          <span>Marketplace</span>
        </NavLink>
        
        <NavLink to="/create-listing" className="rounded-full bg-primary p-3">
          <Plus className="h-6 w-6 text-white" />
        </NavLink>
        
        <NavLink to="/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} relative`}>
          <MessageCircle className="h-6 w-6" />
          <UnreadMessageBadge />
          <span>Messages</span>
        </NavLink>
        
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User className="h-6 w-6" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
