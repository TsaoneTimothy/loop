import { useState, useEffect } from "react";
import { Search, ArrowDownUp, Send, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/shared/Logo";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { MessageUser, Message } from "@/types/messages";

interface Conversation {
  id: string;
  user: MessageUser;
  lastMessage: string;
  time: string;
  unread: number;
}

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<MessageUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userId, profile, isAuthenticated } = useProfile();
  const navigate = useNavigate();
  
  // Fetch conversations for the current user
  useEffect(() => {
    if (!userId) return;
    
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Get all messages where current user is sender or receiver
        // Note: We're using the Raw SQL query function to directly query the messages table
        // since TypeScript doesn't know about our new table yet
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
  }, [userId, toast]);

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60 * 1000) {
      return 'just now';
    }
    
    // Less than an hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}m ago`;
    }
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}h ago`;
    }
    
    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}d ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };

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
      // Use direct SQL query since TypeScript doesn't know about our table yet
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !userId || !isAuthenticated) return;
    
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
      
      setNewMessage("");
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
  }, [userId, selectedUser]);

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-4">Please sign in to access messages</p>
        <Button onClick={() => navigate("/login")}>Sign In</Button>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="pb-20 flex flex-col h-screen">
        <header className="loop-header flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="mr-1" onClick={goBackToList}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
              <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="font-semibold">{selectedUser.name}</h2>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender_id === userId
                      ? "bg-primary text-primary-foreground ml-12"
                      : "bg-muted mr-12"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {formatMessageTime(msg.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <form 
          onSubmit={handleSendMessage}
          className="border-t p-4 flex gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <header className="loop-header flex items-center justify-between">
        <Logo />
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowDownUp className="h-6 w-6" />
        </Button>
      </header>
      
      <div className="px-6 py-3">
        <div className="loop-search">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search messages..." 
            className="border-0 bg-transparent focus-visible:ring-0 pl-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-4 px-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start messaging sellers through the marketplace
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className="flex items-center gap-4 p-3 hover:bg-card rounded-lg cursor-pointer"
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.user.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>
                
                {conversation.unread > 0 && (
                  <div className="flex justify-center items-center bg-primary text-primary-foreground rounded-full h-6 w-6 text-xs font-semibold">
                    {conversation.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
