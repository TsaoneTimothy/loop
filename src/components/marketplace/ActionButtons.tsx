
import { Button } from "@/components/ui/button";
import { Filter, ShoppingBag, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import UnreadMessageBadge from "@/components/messages/UnreadMessageBadge";

const ActionButtons = () => {
  return (
    <>
      <Button variant="ghost" size="icon" className="bg-secondary rounded-full h-10 w-10">
        <Filter className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <ShoppingBag className="h-6 w-6" />
      </Button>
      <NavLink to="/messages" className="relative">
        <Button variant="ghost" size="icon" className="rounded-full">
          <MessageCircle className="h-6 w-6" />
          <UnreadMessageBadge />
        </Button>
      </NavLink>
    </>
  );
};

export default ActionButtons;
