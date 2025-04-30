
export interface UserInfo {
  id: number;
  name: string;
  username: string;
  avatar: string;
  role: string;
  verified: boolean;
}

export interface FeedItem {
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
  user: UserInfo;
  link?: string;
}

export interface FeedCategory {
  id: string;
  name: string;
  icon: JSX.Element;
}
