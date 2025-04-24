
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import AppSidebar from "./AppSidebar";
import Logo from "./shared/Logo";

interface LayoutProps {
  onLogout: () => void;
}

const Layout = ({ onLogout }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Floating sidebar for desktop */}
      <AppSidebar />
      
      {/* Main content */}
      <div className="flex-1 md:pl-20">
        <div className="max-w-none mx-auto">
          <header className="p-4 border-b border-border md:hidden">
            <Logo />
          </header>
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
