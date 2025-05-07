
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Conversation } from "@/types/messages";

interface ConversationItemProps {
  conversation: Conversation;
  onClick: () => void;
}

const ConversationItem = ({ conversation, onClick }: ConversationItemProps) => {
  return (
    <div 
      className="flex items-center gap-4 p-3 hover:bg-card rounded-lg cursor-pointer"
      onClick={onClick}
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
  );
};

export default ConversationItem;
