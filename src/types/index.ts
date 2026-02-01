export type UserProfile = {
  id: string;
  username: string | null;
  email: string;
  is_admin: boolean | null;
  avatar_url: string | null;
};

export type Post = {
  id: string;
  user_id: string;
  type: 'found' | 'lost';
  title: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
  contact: string | null;
  reward: string | null;
  date_occurred: string | null;
  created_at: string;
  user_profiles?: UserProfile;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user_profiles?: UserProfile;
  posts?: Post;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: UserProfile;
  receiver?: UserProfile;
};

export type Language = 'uz' | 'en' | 'ru';
