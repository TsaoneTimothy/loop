
export interface MessageUser {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  user: MessageUser;
  lastMessage: string;
  time: string;
  unread: number;
  participants?: string[];
  unreadCount?: number;
}

export interface ConversationWithProfiles {
  id: string;
  participants: string[];
  last_message?: string;
  last_message_time?: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;
  }[];
}
