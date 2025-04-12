import { NavLink } from "react-router-dom";
import { Home, MessageCircle, User, Store, Plus, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const AppSidebar = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 4, y: 50 }); // default position
  const sidebarRef = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (sidebarRef.current) {
      const rect = sidebarRef.current.getBoundingClientRect();
      initialPositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && sidebarRef.current) {
      const newX = e.clientX - initialPositionRef.current.x;
      const newY = e.clientY - initialPositionRef.current.y;
      
      // Calculate percentage for the y position
      const viewportHeight = window.innerHeight;
      const yPercentage = (newY / viewportHeight) * 100;
      
      // Constrain to viewport boundaries
      const boundedX = Math.max(0, Math.min(newX, window.innerWidth - 80));
      const boundedY = Math.max(10, Math.min(yPercentage, 90));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={sidebarRef}
      className="h-auto w-[60px] bg-card border border-border rounded-lg shadow-md hidden md:block px-2 py-6 fixed z-50 cursor-move"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}%`, 
        transform: 'translateY(-50%)'
      }}
    >
      <div 
        ref={dragHandleRef}
        className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-full p-1 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="h-3 w-3" />
      </div>
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
