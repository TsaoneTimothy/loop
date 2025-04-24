
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";

const FeedHeader = () => {
  return (
    <header className="loop-header flex justify-between items-center py-6">
      <Logo size="large" />
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default FeedHeader;
