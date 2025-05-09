
import { UserInfo } from "./feed";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
}

export interface PostItemProps {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  image: string;
  orientation: string;
  likes: number;
  comments: number;
  saved: boolean;
  liked?: boolean;
  user: UserInfo;
  onToggleSaved: (id: number) => void;
  onToggleLike?: (id: number) => Promise<void>;
  onAddComment?: (comment: string) => Promise<boolean>;
  link?: string;
  expiresAt?: string;
}
