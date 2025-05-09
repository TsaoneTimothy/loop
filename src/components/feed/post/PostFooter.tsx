
import React from "react";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostFooterProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onToggleLike: () => void;
  onToggleComments: () => void;
}

const PostFooter: React.FC<PostFooterProps> = ({
  likesCount,
  commentsCount,
  isLiked,
  onToggleLike,
  onToggleComments,
}) => {
  return (
    <div className="flex justify-between items-center border-t border-border pt-3">
      <div className="flex items-center gap-4">
        <button 
          className={`flex items-center gap-1 ${isLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}
          onClick={onToggleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary' : ''}`} />
          <span className="text-sm">{likesCount}</span>
        </button>
        
        <button 
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          onClick={onToggleComments}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm">{commentsCount}</span>
        </button>
      </div>
      
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default PostFooter;
