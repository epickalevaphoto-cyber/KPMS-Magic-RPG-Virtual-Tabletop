import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для таблиц
export interface Room {
  id: string;
  code: string;
  password: string | null;
  name: string;
  master_id: string;
  status: 'waiting' | 'playing' | 'finished';
  created_at: string;
}

export interface Player {
  id: string;
  room_code: string;
  user_id: string;
  name: string;
  role: 'master' | 'player';
  joined_at: string;
}

export interface ChatMessage {
  id: string;
  room_code: string;
  user_id: string;
  user_name: string;
  text: string;
  type: 'message' | 'roll' | 'system';
  created_at: string;
}

export interface Roll {
  id: string;
  room_code: string;
  user_id: string;
  user_name: string;
  dice_type: string;
  dice_count: number;
  modifier: number;
  results: number[];
  total: number;
  created_at: string;
}
