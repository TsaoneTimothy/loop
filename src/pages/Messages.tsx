import { useState, useEffect } from "react";
import { Search, ArrowDownUp, Send, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Logo from "@/components/shared/Logo";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { Message, MessageUser } from "@/types/messages";

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    sellerId: "1",
    name: "Keith Mompati",
    message: "Sure! It's the M2 chip, 16GB RAM, 512GB SSD.",
    time: "2m ago",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    online: true,
    unread: 2
  },
  {
    id: 2,
    sellerId: "2",
    name: "Jane Smith",
    message: "The textbook is in perfect condition!",
    time: "1h ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    online: true,
    unread: 0
  },
  {
    id: 3,
    sellerId: "3",
    name: "Alex Johnson",
    message: "Yes, the lamp comes with LED bulbs.",
    time: "3h ago",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
    online: false,
    unread: 1
  }
];

// Mock conversations for each seller
const mockConversations: Record<string | number, Array<{ id: number; sender: "user" | "seller"; message: string; time: string }>> = {
  "1": [
    {
      id: 1,
      sender: "user",
      message: "Hi, I'm interested in the MacBook Pro. Is it still available?",
      time: "2:30 PM"
    },
    {
      id: 2,
      sender: "seller",
      message: "Yes, it's still available! It's in great condition, only used for 3 months.",
      time: "2:32 PM"
    },
    {
      id: 3,
      sender: "user",
      message: "Great! Could you tell me more about the specs?",
      time: "2:33 PM"
    },
    {
      id: 4,
      sender: "seller",
      message: "Sure! It's the M2 chip, 16GB RAM, 512GB SSD. Battery cycle count is only 56.",
      time: "2:35 PM"
    }
  ],
  "2": [
    {
      id: 1,
      sender: "user",
      message: "Hello! Is the Calculus textbook still for sale?",
      time: "1:20 PM"
    },
    {
      id: 2,
      sender: "seller",
      message: "Yes, it is! Are you interested in buying it?",
      time: "1:25 PM"
    },
    {
      id: 3,
      sender: "user",
      message: "What's the condition of the book? Any highlights or notes?",
      time: "1:26 PM"
    },
    {
      id: 4,
      sender: "seller",
      message: "The textbook is in perfect condition! No highlights or notes.",
      time: "1:30 PM"
    }
  ],
  "3": [
    {
      id: 1,
      sender: "user",
      message: "Hi! I saw your desk lamp listing. Does it come with bulbs?",
      time: "11:20 AM"
    },
    {
      id: 2,
      sender: "seller",
      message: "Hello! Yes, it comes with LED bulbs included.",
      time: "11:25 AM"
    },
    {
      id: 3,
      sender: "user",
      message: "Great! What's the wattage of the bulbs?",
      time: "11:26 AM"
    },
    {
      id: 4,
      sender: "seller",
      message: "They're 9W LED bulbs, equivalent to about 60W traditional bulbs.",
      time: "11:30 AM"
    }
  ]
};

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedSeller, setSelectedSeller] = useState<{id: string; name: string; avatar: string} | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
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
        // First check if the conversations table exists
        const { error: tableCheckError } = await supabase
          .from('conversations')
          .select('id')
          .limit(1);
        
        // If table doesn't exist, use mock data
        if (tableCheckError) {
          console.log("Using mock conversation data");
          setConversations(mockMessages);
          setLoading(false);
          return;
        }

        // Get all conversations where the current user is a participant
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id,
            participants,
            last_message,
            last_message_time,
            profiles!conversations_participant_profiles_fkey(
              id,
              full_name,
              avatar_url
            )
          `)
          .contains('participants', [userId]);
        
        if (error) {
          console.error("Error fetching conversations:", error);
          // Fall back to mock data
          setConversations(mockMessages);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Format conversations for display
          const formattedConversations = data.map(conv => {
            // Find the other participant (not the current user)
            const otherParticipantId = conv.participants.find(p => p !== userId);
            const otherParticipantProfile = conv.profiles.find(p => p.id === otherParticipantId);
            
            return {
              id: conv.id,
              sellerId: otherParticipantId,
              name: otherParticipantProfile?.full_name || 'User',
              message: conv.last_message || 'Start a conversation!',
              time: conv.last_message_time ? new Date(conv.last_message_time).toLocaleString() : 'Now',
              avatar: otherParticipantProfile?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
              online: false,
              unread: 0
            };
          });
          
          setConversations(formattedConversations);
        } else {
          // No conversations found, use mock data as placeholders
          setConversations(mockMessages);
        }
      } catch (error) {
        console.error("Error in fetchConversations:", error);
        setConversations(mockMessages);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [userId]);

  // Handle seller selection from URL parameters
  useEffect(() => {
    const initializeConversation = async () => {
      const sellerId = searchParams.get("seller");
      if (sellerId) {
        try {
          // Fetch seller profile
          const { data: sellerProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sellerId)
            .single();
            
          if (error) {
            console.error("Error fetching seller profile:", error);
            return;
          }
            
          if (sellerProfile) {
            setSelectedSeller({
              id: sellerProfile.id,
              name: sellerProfile.full_name || 'Seller',
              avatar: sellerProfile.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
            });
            
            // Check if conversation already exists
            const { data: existingConversation, error: convError } = await supabase
              .from('conversations')
              .select('id')
              .contains('participants', [userId, sellerId])
              .maybeSingle();
              
            // If there's an error checking for the conversation, it might be because the table doesn't exist yet
            if (convError && !convError.message.includes('does not exist')) {
              console.error("Error checking conversation:", convError);
            }
            
            // If conversation doesn't exist, create it
            if (!existingConversation && userId && !convError) {
              const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert([{
                  participants: [userId, sellerId],
                  participant_profiles: [userId, sellerId]
                }])
                .select();
                
              if (createError) {
                console.error("Error creating conversation:", createError);
              }
            }
            
            // Load messages for this conversation
            if (existingConversation) {
              fetchMessages(existingConversation.id);
            } else {
              // Use mock conversation data until we can create a real one
              const mockConversation = mockConversations[sellerId] || [];
              loadMockMessages(mockConversation);
            }
          }
        } catch (error) {
          console.error("Error initializing conversation:", error);
        }
      }
    };
    
    if (userId) {
      initializeConversation();
    }
  }, [searchParams, userId]);
  
  // Function to fetch actual messages from database
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          read
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
      
      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          sender: msg.sender_id === userId ? "user" : "seller",
          message: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        // Load the conversation
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error in fetchMessages:", error);
    }
  };
  
  // Function to load mock messages until we implement the real database
  const loadMockMessages = (conversation: any[]) => {
    setMessages(conversation);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSeller || !userId || !isAuthenticated) return;
    
    try {
      // Check if conversations table exists
      const { error: tableCheckError } = await supabase
        .from('conversations')
        .select('id')
        .limit(1);
        
      // If table doesn't exist, update UI optimistically
      if (tableCheckError) {
        // Add message to UI
        const newMsg = {
          id: Date.now().toString(),
          sender: "user",
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage("");
        return;
      }
      
      // Get or create conversation
      const { data: existingConversation, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .contains('participants', [userId, selectedSeller.id])
        .maybeSingle();
        
      if (convError) {
        console.error("Error finding conversation:", convError);
        toast({
          title: "Error",
          description: "Couldn't send message. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      let conversationId = existingConversation?.id;
      
      // Create conversation if it doesn't exist
      if (!existingConversation) {
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert([{
            participants: [userId, selectedSeller.id],
            participant_profiles: [userId, selectedSeller.id]
          }])
          .select();
          
        if (createError || !newConv) {
          console.error("Error creating conversation:", createError);
          toast({
            title: "Error",
            description: "Couldn't create conversation. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        conversationId = newConv[0].id;
      }
      
      // Add message
      if (conversationId) {
        const { error: msgError } = await supabase
          .from('messages')
          .insert([{
            conversation_id: conversationId,
            sender_id: userId,
            content: newMessage,
            read: false
          }]);
          
        if (msgError) {
          console.error("Error sending message:", msgError);
          toast({
            title: "Error",
            description: "Couldn't send message. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        // Update conversation last message
        await supabase
          .from('conversations')
          .update({
            last_message: newMessage,
            last_message_time: new Date().toISOString()
          })
          .eq('id', conversationId);
          
        // Add message to UI
        const newMsg = {
          id: Date.now().toString(),
          sender: "user",
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast({
        title: "Error",
        description: "Couldn't send message. Please try again.",
        variant: "destructive"
      });
    }
    
    setNewMessage("");
  };
  
  // Handle click on a conversation
  const handleConversationClick = (sellerId: number | string) => {
    const seller = conversations.find(m => m.sellerId === sellerId);
    if (seller) {
      setSelectedSeller({
        id: String(seller.sellerId),
        name: seller.name,
        avatar: seller.avatar
      });
      
      // Load conversation
      const conversationData = mockConversations[sellerId] || [];
      loadMockMessages(conversationData);
    }
  };
  
  const goBackToList = () => {
    setSelectedSeller(null);
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.message.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (selectedSeller) {
    return (
      <div className="pb-20 flex flex-col h-screen">
        <header className="loop-header flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="mr-1" onClick={goBackToList}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <img src={selectedSeller.avatar} alt={selectedSeller.name} />
            </Avatar>
            <h2 className="font-semibold">{selectedSeller.name}</h2>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground ml-12"
                    : "bg-muted mr-12"
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
              </div>
            </div>
          ))}
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
            <p className="text-muted-foreground">No messages found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((message) => (
              <div 
                key={message.id} 
                className="flex items-center gap-4 p-3 hover:bg-card rounded-lg cursor-pointer"
                onClick={() => handleConversationClick(message.sellerId)}
              >
                <div className="relative">
                  <Avatar>
                    <img src={message.avatar} alt={message.name} />
                  </Avatar>
                  {message.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold truncate">{message.name}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                </div>
                
                {message.unread > 0 && (
                  <div className="flex justify-center items-center bg-primary text-primary-foreground rounded-full h-6 w-6 text-xs font-semibold">
                    {message.unread}
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
