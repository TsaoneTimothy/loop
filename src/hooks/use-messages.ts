
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageUser } from "@/types/messages";

export const useMessages = (userId: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const { toast } = useToast();

  // Load messages between current user and selected user
  const loadMessages = async (partnerId: string) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error loading messages",
          description: "Could not load message history. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      // Mark received messages as read
      const unreadMessages = data?.filter(msg => 
        msg.sender_id === partnerId && 
        msg.receiver_id === userId && 
        !msg.read
      ) || [];
      
      if (unreadMessages.length > 0) {
        for (const msg of unreadMessages) {
          await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', msg.id);
        }
      }
      
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error loading messages",
        description: "There was a problem loading your messages. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (receiverId: string, newMessage: string) => {
    if (!userId) return null;
    
    try {
      const newMsg = {
        sender_id: userId,
        receiver_id: receiverId,
        content: newMessage,
        read: false
      };
      
      // Insert message into database
      const { data, error } = await supabase
        .from('messages')
        .insert(newMsg)
        .select();
        
      if (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Couldn't send message. Please try again.",
          variant: "destructive"
        });
        return null;
      }
      
      if (data && data.length > 0) {
        // Add message to UI
        setMessages(prev => [...prev, data[0]]);
        return data[0];
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast({
        title: "Error",
        description: "Couldn't send message. Please try again.",
        variant: "destructive"
      });
    }
    return null;
  };

  return {
    messages,
    setMessages,
    loadMessages,
    handleSendMessage
  };
};

export default useMessages;
