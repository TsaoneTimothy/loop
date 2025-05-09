
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Conversation, MessageUser } from "@/types/messages";
import useMessageHelpers from "@/hooks/use-message-helpers";

export const useMessageRealtime = (
  userId: string | null, 
  selectedUser: MessageUser | null,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
) => {
  const { formatMessageTime } = useMessageHelpers();

  // Set up realtime subscription for new messages
  useEffect(() => {
    if (!userId) return;
  
    const channel = supabase
      .channel('messages_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${userId}` 
      }, async (payload) => {
        // Handle new message received
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new;
          
          // If this message is relevant to the current conversation
          if (selectedUser && newMessage.sender_id === selectedUser.id) {
            setMessages(prev => [...prev, newMessage]);
            
            // Mark as read since we're actively viewing this conversation
            await supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMessage.id);
          } 
          
          // Update conversations list
          setConversations(prev => {
            // Find if this sender is already in our conversations
            const existingConvIndex = prev.findIndex(conv => 
              conv.user.id === newMessage.sender_id
            );
            
            // If yes, update the last message
            if (existingConvIndex >= 0) {
              const updatedConv = [...prev];
              updatedConv[existingConvIndex] = {
                ...updatedConv[existingConvIndex],
                lastMessage: newMessage.content,
                time: formatMessageTime(newMessage.created_at),
                unread: updatedConv[existingConvIndex].unread + 
                  (newMessage.sender_id !== selectedUser?.id ? 1 : 0)
              };
              return updatedConv;
            }
            
            // Otherwise, we'll need to fetch this sender's profile
            supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .eq('id', newMessage.sender_id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setConversations(currConvs => [
                    {
                      id: data.id,
                      user: {
                        id: data.id,
                        name: data.full_name || 'Unknown User',
                        avatar: data.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
                        online: true
                      },
                      lastMessage: newMessage.content,
                      time: formatMessageTime(newMessage.created_at),
                      unread: 1
                    },
                    ...currConvs
                  ]);
                }
              });
            
            return prev;
          });
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, selectedUser, formatMessageTime, setMessages, setConversations]);
};

export default useMessageRealtime;
