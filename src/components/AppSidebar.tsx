
import { NavLink } from "react-router-dom";
import { Home, MessageCircle, User, Store, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  return (
    <div className="h-full w-[250px] bg-card border-r border-border hidden md:block px-4 py-6 fixed left-0 top-0 bottom-0">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-8 px-2">Campus Loop</h1>
        
        <nav className="flex-1">
          <div className="space-y-2">
            <NavLink 
              to="/feed" 
              className={({ isActive }) => 
                cn("flex items-center gap-3 px-2 py-3 rounded-lg transition-colors", 
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <Home className="h-5 w-5" />
              <span>Feed</span>
            </NavLink>
            
            <NavLink 
              to="/marketplace" 
              className={({ isActive }) => 
                cn("flex items-center gap-3 px-2 py-3 rounded-lg transition-colors", 
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <Store className="h-5 w-5" />
              <span>Marketplace</span>
            </NavLink>
            
            <NavLink 
              to="/messages" 
              className={({ isActive }) => 
                cn("flex items-center gap-3 px-2 py-3 rounded-lg transition-colors", 
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <MessageCircle className="h-5 w-5" />
              <span>Messages</span>
            </NavLink>
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                cn("flex items-center gap-3 px-2 py-3 rounded-lg transition-colors", 
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </NavLink>
          </div>
        </nav>
        
        <div className="mt-auto">
          <NavLink 
            to="/create-listing" 
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg w-full justify-center"
          >
            <Plus className="h-5 w-5" />
            <span>Create Listing</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
