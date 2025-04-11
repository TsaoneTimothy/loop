
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

interface LayoutProps {
  onLogout: () => void;
}

const Layout = ({ onLogout }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 ml-0 md:ml-[calc(var(--sidebar-width-icon)+8px)] transition-all duration-200 ease-in-out overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
