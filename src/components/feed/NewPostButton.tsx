
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewPostButtonProps {
  onClick: () => void;
}

const NewPostButton: React.FC<NewPostButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-6 md:bottom-8 md:right-8 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
      size="icon"
      aria-label="Create new post"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default NewPostButton;
