
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

interface MessageUser {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: MessageUser;
  receiver?: MessageUser;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
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
        // We'll need to implement a more comprehensive solution in the future
        // For now, we'll fetch users with whom the current user has messaged
        const { data: sentMessages, error: sentError } = await supabase
          .from('messages')
          .select('receiver_id, content, created_at')
          .eq('sender_id', userId)
          .order('created_at', { ascending: false });
          
        const { data: receivedMessages, error: receivedError } = await supabase
          .from('messages')
          .select('sender_id, content, created_at')
          .eq('receiver_id', userId)
          .order('created_at', { ascending: false });
          
        if (sentError || receivedError) {
          console.error("Error fetching messages:", sentError || receivedError);
          return;
        }
        
        // Get unique user IDs from both sent and received messages
        const uniqueUserIds = new Set<string>();
        sentMessages?.forEach(msg => uniqueUserIds.add(msg.receiver_id));
        receivedMessages?.forEach(msg => uniqueUserIds.add(msg.sender_id));
        
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
          // Find the latest message from sent or received
          const latestSent = sentMessages?.find(msg => msg.receiver_id === profile.id);
          const latestReceived = receivedMessages?.find(msg => msg.sender_id === profile.id);
          
          // Determine which message is more recent
          let latestMessage;
          let time;
          
          if (latestSent && latestReceived) {
            if (new Date(latestSent.created_at) > new Date(latestReceived.created_at)) {
              latestMessage = latestSent.content;
              time = formatMessageTime(latestSent.created_at);
            } else {
              latestMessage = latestReceived.content;
              time = formatMessageTime(latestReceived.created_at);
            }
          } else if (latestSent) {
            latestMessage = latestSent.content;
            time = formatMessageTime(latestSent.created_at);
          } else if (latestReceived) {
            latestMessage = latestReceived.content;
            time = formatMessageTime(latestReceived.created_at);
          } else {
            latestMessage = "No messages yet";
            time = "Just now";
          }
          
          return {
            id: profile.id,
            user: {
              id: profile.id,
              name: profile.full_name || 'User',
              avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
              online: Math.random() > 0.5 // Random online status for now
            },
            lastMessage: latestMessage,
            time,
            unread: Math.floor(Math.random() * 3) // Random unread count for now
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
      // Get messages where current user is sender and partner is receiver
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, created_at')
        .eq('sender_id', userId)
        .eq('receiver_id', partnerId)
        .order('created_at', { ascending: true });
        
      // Get messages where partner is sender and current user is receiver
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, created_at')
        .eq('sender_id', partnerId)
        .eq('receiver_id', userId)
        .order('created_at', { ascending: true });
        
      if (sentError || receivedError) {
        console.error("Error fetching messages:", sentError || receivedError);
        return;
      }
      
      // Combine and sort messages
      const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
      allMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setMessages(allMessages);
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
        content: newMessage
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
