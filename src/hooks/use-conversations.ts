
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import useMessageHelpers from "@/hooks/use-message-helpers";
import { Conversation } from "@/types/messages";
import { useToast } from "@/hooks/use-toast";

const useConversations = (userId: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { formatMessageTime } = useMessageHelpers();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Fetch all messages for this user
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching conversations:", error);
          toast({
            title: "Error loading conversations",
            description: "Could not load your conversations. Please try again later.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        if (!messages || messages.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        // Get unique user IDs that this user has conversed with
        const conversationPartnerIds = [...new Set(
          messages.map(msg => 
            msg.sender_id === userId ? msg.receiver_id : msg.sender_id
          )
        )];

        // Fetch profiles for all conversation partners
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', conversationPartnerIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          toast({
            title: "Error loading user profiles",
            description: "Could not load conversation partners. Please try again later.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Create a map for quick access to profile data
        const profileMap = new Map();
        profiles?.forEach(profile => {
          profileMap.set(profile.id, profile);
        });

        // Group messages by conversation partner
        const conversationMap = new Map();
        messages.forEach(message => {
          const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
          
          if (!conversationMap.has(partnerId)) {
            // This is the first message with this partner
            conversationMap.set(partnerId, {
              lastMessage: message.content,
              time: formatMessageTime(message.created_at),
              unread: message.receiver_id === userId && !message.read ? 1 : 0,
              messageObj: message,
            });
          } else {
            // Only update if this message is newer
            const existing = conversationMap.get(partnerId);
            if (new Date(message.created_at) > new Date(existing.messageObj.created_at)) {
              existing.lastMessage = message.content;
              existing.time = formatMessageTime(message.created_at);
              existing.messageObj = message;
            }
            
            // Count unread messages
            if (message.receiver_id === userId && !message.read) {
              existing.unread += 1;
            }
          }
        });

        // Convert the map to an array of conversation objects
        const conversationArray: Conversation[] = Array.from(conversationMap.entries()).map(
          ([partnerId, data]) => {
            const profile = profileMap.get(partnerId);
            return {
              id: partnerId,
              user: {
                id: partnerId,
                name: profile?.full_name || 'Unknown User',
                avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
                online: false // We could implement presence later
              },
              lastMessage: data.lastMessage,
              time: data.time,
              unread: data.unread
            };
          }
        );

        // Sort by most recent message
        conversationArray.sort((a, b) => {
          const aMsg = conversationMap.get(a.id).messageObj;
          const bMsg = conversationMap.get(b.id).messageObj;
          return new Date(bMsg.created_at).getTime() - new Date(aMsg.created_at).getTime();
        });

        setConversations(conversationArray);
      } catch (err) {
        console.error("Error in fetchConversations:", err);
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId, formatMessageTime, toast]);

  return { conversations, loading, setConversations };
};

export default useConversations;
