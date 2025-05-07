
import { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { MessageUser } from "@/types/messages";
import MessageList from "@/components/messages/MessageList";
import ChatView from "@/components/messages/ChatView";
import AuthRequired from "@/components/messages/AuthRequired";
import useConversations from "@/hooks/use-conversations";
import useMessages from "@/hooks/use-messages";
import useMessageHelpers from "@/hooks/use-message-helpers";
import useMessageRealtime from "@/hooks/use-message-realtime";
import InitializeConversation from "@/components/messages/InitializeConversation";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<MessageUser | null>(null);
  const { userId, isAuthenticated } = useProfile();
  const { formatMessageTime } = useMessageHelpers();
  const { conversations, loading, setConversations } = useConversations(userId);
  const { messages, setMessages, loadMessages, handleSendMessage } = useMessages(userId);
  
  // Setup realtime messaging
  useMessageRealtime(userId, selectedUser, setMessages, setConversations);
  
  // Handle conversation initialization from URL
  if (isAuthenticated) {
    <InitializeConversation 
      userId={userId}
      isAuthenticated={isAuthenticated}
      setSelectedUser={setSelectedUser}
      loadMessages={loadMessages}
    />
  }
  
  // Handle click on a conversation
  const handleConversationClick = (conversation: any) => {
    setSelectedUser(conversation.user);
    loadMessages(conversation.user.id);
  };
  
  const goBackToList = () => {
    setSelectedUser(null);
  };

  const onSendMessage = async (newMessage: string) => {
    if (!selectedUser || !userId) return;
    await handleSendMessage(selectedUser.id, newMessage);
  };

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
        onSendMessage={onSendMessage}
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
