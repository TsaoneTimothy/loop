
import { useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageUser } from "@/types/messages";

interface MessageItem {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

interface ChatViewProps {
  user: MessageUser;
  messages: MessageItem[];
  currentUserId: string;
  onBack: () => void;
  onSendMessage: (message: string) => void;
  formatMessageTime: (timestamp: string) => string;
}

const ChatView = ({ 
  user, 
  messages, 
  currentUserId, 
  onBack, 
  onSendMessage,
  formatMessageTime 
}: ChatViewProps) => {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="pb-20 flex flex-col h-screen">
      <header className="loop-header flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="mr-1" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{user.name}</h2>
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
              className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender_id === currentUserId
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
        onSubmit={handleSubmit}
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
};

export default ChatView;
