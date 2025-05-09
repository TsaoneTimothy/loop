
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Newspaper, Store, Tag, Tags } from "lucide-react";

interface PostBadgeProps {
  type: string;
  date: string;
  isDiscount?: boolean;
}

const PostBadge: React.FC<PostBadgeProps> = ({ type, date, isDiscount = false }) => {
  const getBadgeVariant = () => {
    if (type === "event") return "secondary";
    if (type === "announcement" || type === "news") return "destructive";
    if (type === "store") return "default";
    return "outline";
  };

  const getIcon = () => {
    switch (type) {
      case "event":
        return <Calendar className="h-3 w-3" />;
      case "announcement":
      case "news":
        return <Newspaper className="h-3 w-3" />;
      case "store":
        return <Store className="h-3 w-3" />;
      case "discount":
        return <Tag className="h-3 w-3" />;
      case "coupon":
        return <Tags className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center mb-3">
      <Badge 
        variant={getBadgeVariant()}
        className={`px-3 py-1 capitalize flex items-center gap-1 ${isDiscount ? 'bg-purple-200 text-purple-700 border-purple-300 dark:bg-purple-800/50 dark:text-purple-300 dark:border-purple-600' : ''}`}
      >
        {getIcon()}
        {type}
      </Badge>
      <span className="text-muted-foreground text-xs">{date}</span>
    </div>
  );
};

export default PostBadge;
