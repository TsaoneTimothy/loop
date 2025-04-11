
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

interface LayoutProps {
  onLogout: () => void;
}

const Layout = ({ onLogout }: LayoutProps) => {
  return (
    <div className="loop-container">
      <Outlet />
      <Navigation />
    </div>
  );
};

export default Layout;
