
import React, { useState, useEffect } from "react";
import { Bookmark, Heart, MessageSquare, Share2, Calendar, Store, Newspaper, Tag, Tags, Clock, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";

interface UserInfo {
  id: number;
  name: string;
  username: string;
  avatar: string;
  role: string;
  verified: boolean;
}

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
  liked?: boolean;
  user: UserInfo;
  onToggleSaved: (id: number) => void;
  onToggleLike?: (id: number) => void;
  onAddComment?: (comment: string) => Promise<boolean>;
  link?: string;
  expiresAt?: string;
}

const PostItem = ({ 
  id, 
  type, 
  title, 
  description, 
  date, 
  image, 
  orientation, 
  likes: initialLikes, 
  comments: initialComments, 
  saved, 
  liked = false,
  user, 
  onToggleSaved,
  onToggleLike,
  onAddComment,
  link,
  expiresAt
}: PostItemProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [isLiked, setIsLiked] = useState(liked);
  const { profile } = useProfile();

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('listing_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedComments: Comment[] = data.map(comment => ({
          id: comment.id,
          content: comment.content,
          created_at: new Date(comment.created_at).toLocaleDateString(),
          user: {
            name: comment.profiles?.full_name || 'Anonymous',
            username: (comment.profiles?.full_name || 'anonymous').toLowerCase().replace(/\s/g, ''),
            avatar: comment.profiles?.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
          }
        }));
        
        setCommentsList(formattedComments);
        setCommentsCount(formattedComments.length);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !onAddComment) return;
    
    setIsSubmitting(true);
    const success = await onAddComment(commentText);
    
    if (success) {
      setCommentText("");
      fetchComments();
    }
    
    setIsSubmitting(false);
  };

  const handleToggleLike = () => {
    if (onToggleLike) {
      onToggleLike(id);
      if (!isLiked) {
        setLikesCount(prev => prev + 1);
      } else {
        setLikesCount(prev => Math.max(0, prev - 1));
      }
      setIsLiked(!isLiked);
    }
  };

  const renderTitle = () => {
    if (link) {
      return (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xl font-bold mb-2 hover:text-primary transition-colors"
        >
          {title} <span className="text-xs">↗</span>
        </a>
      );
    }
    return <h3 className="text-xl font-bold mb-2">{title}</h3>;
  };
  
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
              : type === "announcement" || type === "news"
                ? "destructive" 
                : type === "store" 
                  ? "default" 
                  : type === "discount"
                    ? "outline"
                    : type === "coupon"
                      ? "secondary"
                      : "outline"
          }
          className="px-3 py-1 capitalize flex items-center gap-1"
        >
          {type === "event" && <Calendar className="h-3 w-3" />}
          {type === "announcement" && <Newspaper className="h-3 w-3" />}
          {type === "news" && <Newspaper className="h-3 w-3" />}
          {type === "store" && <Store className="h-3 w-3" />}
          {type === "discount" && <Tag className="h-3 w-3" />}
          {type === "coupon" && <Tags className="h-3 w-3" />}
          {type}
        </Badge>
        <span className="text-muted-foreground text-xs">{date}</span>
      </div>
      
      {/* Post Title */}
      {renderTitle()}
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      
      {/* Expiry date for discounts */}
      {type === "discount" && expiresAt && (
        <div className="flex items-center gap-1 mb-3 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Expires: {expiresAt}</span>
        </div>
      )}
      
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
          <button 
            className={`flex items-center gap-1 ${isLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}
            onClick={handleToggleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary' : ''}`} />
            <span className="text-sm">{likesCount}</span>
          </button>
          
          <button 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">{commentsCount}</span>
          </button>
        </div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="font-medium mb-2">Comments</h4>
          
          {/* Comment Input */}
          <div className="flex gap-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'You'} />
              <AvatarFallback>{(profile?.full_name || 'A').charAt(0)}</AvatarFallback>
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
            {commentsList.length > 0 ? (
              commentsList.map((comment) => (
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
      )}
    </div>
  );
};

export default PostItem;
