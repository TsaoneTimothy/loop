import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { MessageUser, Message } from "@/types/messages";
import MessageList from "@/components/messages/MessageList";
import ChatView from "@/components/messages/ChatView";
import AuthRequired from "@/components/messages/AuthRequired";
import useMessageHelpers from "@/hooks/use-message-helpers";

interface Conversation {
  id: string;
  user: MessageUser;
  lastMessage: string;
  time: string;
  unread: number;
}

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<MessageUser | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { userId, profile, isAuthenticated } = useProfile();
  const navigate = useNavigate();
  const { formatMessageTime } = useMessageHelpers();
  
  // Fetch conversations for the current user
  useEffect(() => {
    if (!userId) return;
    
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Get all messages where current user is sender or receiver
        const { data: messageData, error: messageError } = await supabase
          .rpc('fetch_user_messages', { user_id: userId })
          .select('*')
          .catch(() => {
            // Fallback if the RPC doesn't exist yet - direct SQL query
            return supabase
              .from('messages')
              .select('*')
              .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
              .order('created_at', { ascending: false });
          });
          
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

  // Handle seller selection from URL parameters
  useEffect(() => {
    const initializeConversation = async () => {
      const sellerId = searchParams.get("seller");
      if (!sellerId || !userId) return;
      
      try {
        // Fetch seller profile
        const { data: sellerProfile, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', sellerId)
          .single();
          
        if (error) {
          console.error("Error fetching seller profile:", error);
          return;
        }
          
        if (sellerProfile) {
          setSelectedUser({
            id: sellerProfile.id,
            name: sellerProfile.full_name || 'User',
            avatar: sellerProfile.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
          });
          
          // Load existing messages
          loadMessages(sellerId);
        }
      } catch (error) {
        console.error("Error initializing conversation:", error);
      }
    };
    
    if (userId && isAuthenticated) {
      initializeConversation();
    }
  }, [searchParams, userId, isAuthenticated]);
  
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
        return;
      }
      
      // Mark received messages as read
      const unreadMessages = data?.filter(msg => 
        msg.sender_id === partnerId && 
        msg.receiver_id === userId && 
        !msg.read
      ) || [];
      
      if (unreadMessages.length > 0) {
        unreadMessages.forEach(async (msg) => {
          await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', msg.id);
        });
      }
      
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (newMessage: string) => {
    if (!selectedUser || !userId || !isAuthenticated) return;
    
    try {
      const newMsg = {
        sender_id: userId,
        receiver_id: selectedUser.id,
        content: newMessage,
        read: false
      };
      
      // Insert message into database
      const { data, error } = await supabase
        .from('messages')
        .insert(newMsg)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Add message to UI
        setMessages(prev => [...prev, data[0]]);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast({
        title: "Error",
        description: "Couldn't send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle click on a conversation
  const handleConversationClick = (conversation: Conversation) => {
    setSelectedUser(conversation.user);
    loadMessages(conversation.user.id);
  };
  
  const goBackToList = () => {
    setSelectedUser(null);
  };

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
      }, (payload) => {
        // Handle new message received
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new;
          
          // If this message is relevant to the current conversation
          if (selectedUser && newMessage.sender_id === selectedUser.id) {
            setMessages(prev => [...prev, newMessage]);
            
            // Mark as read since we're actively viewing this conversation
            supabase
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
                        name: data.full_name || 'User',
                        avatar: data.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
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
  }, [userId, selectedUser, formatMessageTime]);

  if (!isAuthenticated) {
    return <AuthRequired />;
  }

  if (selectedUser) {
    return (
      <ChatView
        user={selectedUser}
        messages={messages}
        currentUserId={userId || ""}
        onBack={goBackToList}
        onSendMessage={handleSendMessage}
        formatMessageTime={formatMessageTime}
      />
    );
  }

  return (
    <MessageList 
      conversations={conversations}
      loading={loading}
      onSelectConversation={handleConversationClick}
    />
  );
};

export default Messages;
