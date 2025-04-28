
import { useState, useEffect } from "react";
import { Search, ArrowDownUp, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Logo from "@/components/shared/Logo";
import { useSearchParams } from "react-router-dom";

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    name: "Sarah Parker",
    message: "Is the calculus textbook still available?",
    time: "2m ago",
    avatar: "/placeholder.svg",
    online: true,
    unread: 2
  },
  {
    id: 2,
    name: "Mike Johnson",
    message: "Thanks for the quick response!",
    time: "1h ago",
    avatar: "/placeholder.svg",
    online: true,
    unread: 0
  },
  {
    id: 3,
    name: "Emily Chen",
    message: "Could you hold it until tomorrow?",
    time: "3h ago",
    avatar: "/placeholder.svg",
    online: false,
    unread: 1
  },
  {
    id: 4,
    name: "Alex Thompson",
    message: "Perfect! See you at the library",
    time: "1d ago",
    avatar: "/placeholder.svg",
    online: false,
    unread: 0
  },
  {
    id: 5,
    name: "Jordan Smith",
    message: "What's the lowest you can go?",
    time: "2d ago",
    avatar: "/placeholder.svg",
    online: false,
    unread: 0
  }
];

// Mock conversation with Keith
const keithConversation = [
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
];

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [searchParams] = useSearchParams();
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  useEffect(() => {
    const seller = searchParams.get("seller");
    if (seller === "1") { // Keith's ID
      setSelectedSeller("Keith Mompati");
    }
  }, [searchParams]);

  // Filter messages based on search query
  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setNewMessage("");
  };

  if (selectedSeller) {
    return (
      <div className="pb-20 flex flex-col h-screen">
        <header className="loop-header flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36" alt={selectedSeller} />
            </Avatar>
            <h2 className="font-semibold">{selectedSeller}</h2>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {keithConversation.map((msg) => (
            <div
              key={msg.id}
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
          <Button type="submit" size="icon">
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
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No messages found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className="flex items-center gap-4 p-3 hover:bg-card rounded-lg cursor-pointer"
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
