
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import AppSidebar from "./AppSidebar";

interface LayoutProps {
  onLogout: () => void;
}

const Layout = ({ onLogout }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <AppSidebar />
      
      {/* Main content */}
      <div className="flex-1 md:ml-[250px]">
        <div className="max-w-none mx-auto">
          <Outlet />
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
};

export default Layout;
