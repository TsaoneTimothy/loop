
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Calendar, Newspaper, MessageSquare, Store } from "lucide-react";

interface NewPostTypeSelectorProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

const POST_TYPES = [
  {
    id: "discount",
    name: "Discount",
    description: "Share a discount or special offer",
    icon: Tag,
  },
  {
    id: "event",
    name: "Event",
    description: "Announce an upcoming event",
    icon: Calendar,
  },
  {
    id: "news",
    name: "News",
    description: "Share news with the community",
    icon: Newspaper,
  },
  {
    id: "announcement",
    name: "Announcement",
    description: "Make a general announcement",
    icon: MessageSquare,
  },
  {
    id: "coupon",
    name: "Coupon",
    description: "Share a coupon code",
    icon: Store,
  },
];

const NewPostTypeSelector: React.FC<NewPostTypeSelectorProps> = ({
  onSelect,
  onClose,
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Create New Post</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Select the type of post you want to create
      </p>
      
      <div className="grid gap-3">
        {POST_TYPES.map((type) => (
          <Card
            key={type.id}
            className="flex items-center p-3 cursor-pointer hover:bg-accent"
            onClick={() => onSelect(type.id)}
          >
            <div className="rounded-full bg-muted p-2 mr-3">
              <type.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{type.name}</p>
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewPostTypeSelector;
