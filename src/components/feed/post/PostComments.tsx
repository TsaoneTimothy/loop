
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
}

interface PostCommentsProps {
  comments: Comment[];
  userAvatar: string;
  userName: string;
  onAddComment: (comment: string) => Promise<boolean>;
}

const PostComments: React.FC<PostCommentsProps> = ({
  comments,
  userAvatar,
  userName,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    const success = await onAddComment(commentText);
    
    if (success) {
      setCommentText("");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <h4 className="font-medium mb-2">Comments</h4>
      
      {/* Comment Input */}
      <div className="flex gap-2 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{(userName || 'A').charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input 
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <Button 
            size="sm" 
            onClick={handleSubmitComment}
            disabled={isSubmitting || !commentText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm">{comment.user.name}</span>
                  <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
                <span className="text-xs text-muted-foreground">{comment.created_at}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default PostComments;
