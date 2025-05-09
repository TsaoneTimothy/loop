
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { UserInfo } from "@/types/feed";

interface PostHeaderProps {
  user: UserInfo;
  isSaved: boolean;
  onToggleSaved: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ user, isSaved, onToggleSaved }) => {
  return (
    <div className="flex items-center mb-4">
      <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-sm">{user.name}</span>
            {user.verified && (
              <span className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            @{user.username} • 
            <span className="ml-1 capitalize">
              {user.role === "merchant" ? "Seller" : user.role}
            </span>
          </span>
        </div>
      </Link>
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleSaved}
        >
          <Bookmark
            className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
};

export default PostHeader;
