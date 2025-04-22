
import React from "react";
import { Bookmark, Heart, MessageSquare, Share2, Calendar, Store, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UserInfo {
  id: number;
  name: string;
  username: string;
  avatar: string;
  role: string;
  verified: boolean;
}

interface PostItemProps {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  image: string;
  orientation: string;
  likes: number;
  comments: number;
  saved: boolean;
  user: UserInfo;
  onToggleSaved: (id: number) => void;
}

const PostItem = ({ 
  id, 
  type, 
  title, 
  description, 
  date, 
  image, 
  orientation, 
  likes, 
  comments, 
  saved, 
  user, 
  onToggleSaved 
}: PostItemProps) => {
  return (
    <div className="loop-card overflow-hidden">
      {/* User Profile Header */}
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
            onClick={() => onToggleSaved(id)}
          >
            <Bookmark
              className={`h-5 w-5 ${saved ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        </div>
      </div>
      
      {/* Badge for post type */}
      <div className="flex justify-between items-center mb-3">
        <Badge 
          variant={
            type === "event" 
              ? "secondary" 
              : type === "announcement" 
                ? "destructive" 
                : type === "store" 
                  ? "default" 
                  : "outline"
          }
          className="px-3 py-1 capitalize flex items-center gap-1"
        >
          {type === "event" && <Calendar className="h-3 w-3" />}
          {type === "announcement" && "Announcement"}
          {type === "store" && <Store className="h-3 w-3" />}
          {type === "news" && <Newspaper className="h-3 w-3" />}
          {type === "event" && "Event"}
          {type === "store" && "Store"}
          {type === "news" && "News"}
        </Badge>
        <span className="text-muted-foreground text-xs">{date}</span>
      </div>
      
      {/* Post Title */}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      
      {/* Card Image - Responsive based on orientation */}
      <div 
        className={`overflow-hidden rounded-lg mb-3 ${
          orientation === "portrait" 
            ? "h-64 md:h-80 w-full md:w-2/3 mx-auto" 
            : "h-48 md:h-64 w-full"
        }`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Card Footer */}
      <div className="flex justify-between items-center border-t border-border pt-3">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
            <span className="text-sm">{likes}</span>
          </button>
          
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">{comments}</span>
          </button>
        </div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default PostItem;
