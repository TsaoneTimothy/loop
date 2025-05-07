
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageUser, Conversation } from "@/types/messages";
import useMessageHelpers from "@/hooks/use-message-helpers";

export const useConversations = (userId: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { formatMessageTime } = useMessageHelpers();

  // Fetch conversations for the current user
  useEffect(() => {
    if (!userId) return;
    
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Get all messages where current user is sender or receiver
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false });
          
        if (messageError) {
          console.error("Error fetching messages:", messageError);
          return;
        }
        
        if (!messageData || messageData.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        // Get unique user IDs from both sent and received messages
        const uniqueUserIds = new Set<string>();
        messageData.forEach((msg: any) => {
          // Add the other user to the set (not the current user)
          if (msg.sender_id === userId) {
            uniqueUserIds.add(msg.receiver_id);
          } else {
            uniqueUserIds.add(msg.sender_id);
          }
        });
        
        const userIds = Array.from(uniqueUserIds);
        
        if (userIds.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        // Fetch user profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          return;
        }
        
        // Create conversation objects
        const conversationsData: Conversation[] = profiles?.map(profile => {
          // Find the latest message from sent or received where the other user is this profile
          const latestMessage = messageData
            .filter((msg: any) => 
              (msg.sender_id === profile.id && msg.receiver_id === userId) || 
              (msg.sender_id === userId && msg.receiver_id === profile.id)
            )
            .sort((a: any, b: any) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];
          
          // Count unread messages
          const unreadCount = messageData.filter((msg: any) => 
            msg.sender_id === profile.id && 
            msg.receiver_id === userId && 
            !msg.read
          ).length;
          
          return {
            id: profile.id,
            user: {
              id: profile.id,
              name: profile.full_name || 'User',
              avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
              online: Math.random() > 0.5 // Random online status for now
            },
            lastMessage: latestMessage?.content || "No messages yet",
            time: latestMessage ? formatMessageTime(latestMessage.created_at) : "Just now",
            unread: unreadCount
          };
        }) || [];
        
        setConversations(conversationsData);
      } catch (error) {
        console.error("Error in fetchConversations:", error);
        toast({
          title: "Error loading conversations",
          description: "Could not load your conversations. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [userId, toast, formatMessageTime]);

  return { conversations, loading, setConversations };
};

export default useConversations;
