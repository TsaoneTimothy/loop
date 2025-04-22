
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeedHeader = () => {
  return (
    <header className="loop-header">
      <h1 className="loop-title">Feed</h1>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default FeedHeader;
