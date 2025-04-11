
import { NavLink } from "react-router-dom";
import { Home, MessageCircle, User, Store, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  return (
    <div className="h-auto w-[60px] bg-card border border-border rounded-lg shadow-md hidden md:block px-2 py-6 fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col h-full items-center">
        <nav className="flex-1">
          <div className="space-y-6 flex flex-col items-center">
            <NavLink 
              to="/feed" 
              className={({ isActive }) => 
                cn("flex items-center justify-center rounded-lg transition-colors p-2", 
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
              title="Feed"
            >
              <Home className="h-5 w-5" />
            </NavLink>
            
            <NavLink 
              to="/marketplace" 
              className={({ isActive }) => 
                cn("flex items-center justify-center rounded-lg transition-colors p-2", 
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
              title="Marketplace"
            >
              <Store className="h-5 w-5" />
            </NavLink>
            
            <NavLink 
              to="/messages" 
              className={({ isActive }) => 
                cn("flex items-center justify-center rounded-lg transition-colors p-2", 
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
              title="Messages"
            >
              <MessageCircle className="h-5 w-5" />
            </NavLink>
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                cn("flex items-center justify-center rounded-lg transition-colors p-2", 
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
              title="Profile"
            >
              <User className="h-5 w-5" />
            </NavLink>
          </div>
        </nav>
        
        <div className="mt-6">
          <NavLink 
            to="/create-listing" 
            className="flex items-center justify-center bg-primary text-primary-foreground p-2 rounded-lg"
            title="Create Listing"
          >
            <Plus className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
