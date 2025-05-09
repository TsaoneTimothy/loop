
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Comment } from "@/types/post";

export function usePostCommentsState(postId: number) {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  useEffect(() => {
    // Listen for changes to comments in real-time
    const commentsChannel = supabase
      .channel('public:comments')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments',
          filter: `listing_id=eq.${postId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
            fetchComments();
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, [postId]);

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
        .eq('listing_id', String(postId))
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
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    }
  };

  return {
    commentsList,
    showComments,
    setShowComments,
    fetchComments
  };
}
