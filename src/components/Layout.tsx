
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import AppSidebar from "./AppSidebar";

interface LayoutProps {
  onLogout: () => void;
}

const Layout = ({ onLogout }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Floating sidebar for desktop */}
      <AppSidebar />
      
      {/* Main content - adding padding to prevent overlap with sidebar */}
      <div className="flex-1 md:pl-20">
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
