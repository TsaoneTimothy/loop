
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";

interface UnreadMessageBadgeProps {
  className?: string;
}

const UnreadMessageBadge = ({ className }: UnreadMessageBadgeProps) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { userId } = useProfile();
  
  useEffect(() => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }
    
    // Initial fetch of unread message count
    const fetchUnreadMessages = async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', userId)
          .eq('read', false);
          
        if (error) {
          console.error("Error fetching unread messages:", error);
          return;
        }
        
        setUnreadCount(count || 0);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };
    
    fetchUnreadMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('messages_channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${userId}` 
      }, (payload) => {
        // Check if the message is unread
        if (!payload.new.read) {
          setUnreadCount(prevCount => prevCount + 1);
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${userId}` 
      }, (payload) => {
        // If a message was marked as read
        if (payload.old.read === false && payload.new.read === true) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  if (unreadCount === 0) return null;
  
  return (
    <Badge 
      variant="destructive" 
      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs ${className}`}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};

export default UnreadMessageBadge;
