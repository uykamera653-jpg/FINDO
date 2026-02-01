import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string | null;
          email: string;
          is_admin: boolean | null;
          avatar_url: string | null;
        };
      };
      posts: {
        Row: {
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
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          comment: string;
          created_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
      };
    };
  };
};
