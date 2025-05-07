
import { useState, useEffect } from "react";
import { Search, ArrowDownUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageUser, Conversation } from "@/types/messages";
import ConversationItem from "./ConversationItem";
import Logo from "@/components/shared/Logo";

interface MessageListProps {
  conversations: Conversation[];
  loading: boolean;
  onSelectConversation: (conversation: Conversation) => void;
}

const MessageList = ({ conversations, loading, onSelectConversation }: MessageListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <ConversationItem 
                key={conversation.id} 
                conversation={conversation}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
