
import { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavigationItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  showBadge?: boolean;
  badgeComponent?: React.ReactNode;
}

const NavigationItem = ({ to, icon: Icon, label, showBadge = false, badgeComponent }: NavigationItemProps) => {
  return (
    <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} relative`}>
      <Icon className="h-6 w-6" />
      {showBadge && badgeComponent}
      <span>{label}</span>
    </NavLink>
  );
};

export default NavigationItem;
