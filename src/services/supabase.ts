import { createClient } from '@supabase/supabase-js';

// ============================================
// 1. ПОДКЛЮЧЕНИЕ К SUPABASE
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================
// 2. ТИПЫ ДАННЫХ
// ============================================

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
  userId: string;
  userName: string;
  text: string;
  type: 'message' | 'roll' | 'system';
  timestamp: number;
  room_code?: string;
  created_at?: string;
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

// ============================================
// 3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

export const isSupabaseConnected = (): boolean => {
  return isConnected && supabase !== null;
};

export const getSupabaseStatus = (): { connected: boolean; message: string } => {
  if (isConnected && supabase) {
    return { connected: true, message: '✅ Supabase подключен' };
  }
  return { 
    connected: false, 
    message: '⚠️ Supabase не настроен. Работа в локальном режиме.'
  };
};

// ============================================
// 4. ФУНКЦИИ ДЛЯ РАБОТЫ С КОМНАТАМИ
// ============================================

export async function createRoomSupabase(
  masterName: string,
  roomName: string = 'Новая игра',
  password: string = ''
): Promise<{ room: Room | null; error: string | null }> {
  if (!supabase) {
    return { room: null, error: 'Supabase не подключен' };
  }

  try {
    const code = generateRoomCode();
    
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({
        code,
        password: password || null,
        name: roomName,
        master_id: `master_${Date.now()}`,
        status: 'waiting'
      })
      .select()
      .single();

    if (roomError) throw roomError;

    // ... добавление игрока
    return { room, error: null };
  } catch (error: any) {
    console.error('❌ Ошибка создания комнаты:', error);
    return { room: null, error: error.message };
  }
}

export async function joinRoomSupabase(
  code: string,
  password: string,
  playerName: string
): Promise<{ room: Room | null; error: string | null }> {
  if (!supabase) {
    return { room: null, error: 'Supabase не подключен' };
  }

  try {
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (roomError || !room) {
      return { room: null, error: 'Комната не найдена' };
    }

    if (room.status === 'finished') {
      return { room: null, error: 'Комната уже завершена' };
    }

    if (room.password && room.password !== password) {
      return { room: null, error: 'Неверный пароль' };
    }

    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('room_code', code.toUpperCase())
      .eq('name', playerName)
      .maybeSingle();

    if (existingPlayer) {
      return { room: null, error: 'Игрок с таким именем уже есть в комнате' };
    }

    const userId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const { error: playerError } = await supabase
      .from('players')
      .insert({
        room_code: code.toUpperCase(),
        user_id: userId,
        name: playerName,
        role: 'player'
      });

    if (playerError) throw playerError;

    return { room, error: null };
  } catch (error: any) {
    console.error('❌ Ошибка входа в комнату:', error);
    return { room: null, error: error.message || 'Ошибка входа в комнату' };
  }
}

export async function getRoomSupabase(code: string): Promise<Room | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Ошибка получения комнаты:', error);
    return null;
  }
}

export async function getRoomsSupabase(): Promise<Room[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Ошибка получения комнат:', error);
    return [];
  }
}

export async function getPlayersSupabase(code: string): Promise<Player[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('room_code', code.toUpperCase())
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Ошибка получения игроков:', error);
    return [];
  }
}

export async function deleteRoomSupabase(code: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('code', code.toUpperCase());

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('❌ Ошибка удаления комнаты:', error);
    return false;
  }
}

export async function updateRoomStatusSupabase(
  code: string,
  status: 'waiting' | 'playing' | 'finished'
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('rooms')
      .update({ status })
      .eq('code', code.toUpperCase());

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('❌ Ошибка обновления статуса комнаты:', error);
    return false;
  }
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ============================================
// 5. ФУНКЦИИ ДЛЯ ЧАТА
// ============================================

export async function sendMessageSupabase(
  roomCode: string,
  userId: string,
  userName: string,
  text: string,
  type: 'message' | 'roll' | 'system' = 'message'
): Promise<ChatMessage | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_code: roomCode.toUpperCase(),
        user_id: userId,
        user_name: userName,
        text,
        type
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      text: data.text,
      type: data.type,
      timestamp: new Date(data.created_at).getTime(),
      room_code: data.room_code,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error);
    return null;
  }
}

export async function getMessagesSupabase(roomCode: string): Promise<ChatMessage[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .order('created_at', { ascending: true })
      .limit(200);

    if (error) throw error;
    
    return (data || []).map((msg: any) => ({
      id: msg.id,
      userId: msg.user_id,
      userName: msg.user_name,
      text: msg.text,
      type: msg.type,
      timestamp: new Date(msg.created_at).getTime(),
      room_code: msg.room_code,
      created_at: msg.created_at
    }));
  } catch (error) {
    console.error('❌ Ошибка получения сообщений:', error);
    return [];
  }
}

// ============================================
// 6. ПОДПИСКИ В РЕАЛЬНОМ ВРЕМЕНИ
// ============================================

export function subscribeToRoomSupabase(
  code: string,
  onUpdate: (payload: any) => void
) {
  if (!supabase) {
    console.warn('⚠️ Supabase не подключен, подписка недоступна');
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel(`room_${code}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `code=eq.${code.toUpperCase()}`
      },
      (payload: any) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    }
  };
}

export function subscribeToPlayersSupabase(
  code: string,
  onUpdate: (payload: any) => void
) {
  if (!supabase) {
    console.warn('⚠️ Supabase не подключен, подписка недоступна');
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel(`players_${code}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `room_code=eq.${code.toUpperCase()}`
      },
      (payload: any) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    }
  };
}

export function subscribeToMessagesSupabase(
  roomCode: string,
  onNewMessage: (message: ChatMessage) => void
) {
  if (!supabase) {
    console.warn('⚠️ Supabase не подключен, подписка недоступна');
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel(`chat_${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_code=eq.${roomCode.toUpperCase()}`
      },
      (payload: any) => {
        if (payload.new) {
          const msg: ChatMessage = {
            id: payload.new.id,
            userId: payload.new.user_id,
            userName: payload.new.user_name,
            text: payload.new.text,
            type: payload.new.type,
            timestamp: new Date(payload.new.created_at).getTime(),
            room_code: payload.new.room_code,
            created_at: payload.new.created_at
          };
          onNewMessage(msg);
        }
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    }
  };
}

// ============================================
// 7. SQL ДЛЯ СОЗДАНИЯ ТАБЛИЦ
// ============================================

export const SQL_TABLES = `
-- Таблица комнат
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT NOT NULL,
  master_id TEXT NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица игроков
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT REFERENCES rooms(code) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'player',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица сообщений чата
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT REFERENCES rooms(code) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'message',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица бросков
CREATE TABLE IF NOT EXISTS rolls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT REFERENCES rooms(code) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  dice_type TEXT NOT NULL,
  dice_count INTEGER DEFAULT 1,
  modifier INTEGER DEFAULT 0,
  results JSONB NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем Realtime
ALTER TABLE rooms REPLICA IDENTITY FULL;
ALTER TABLE players REPLICA IDENTITY FULL;
ALTER TABLE chat_messages REPLICA IDENTITY FULL;
ALTER TABLE rolls REPLICA IDENTITY FULL;

-- Создаем индексы
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
CREATE INDEX IF NOT EXISTS idx_players_room_code ON players(room_code);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_code ON chat_messages(room_code);
CREATE INDEX IF NOT EXISTS idx_rolls_room_code ON rolls(room_code);
`;

// ============================================
// 8. ЭКСПОРТ
// ============================================

export default {
  supabase,
  isSupabaseConnected,
  getSupabaseStatus,
  createRoomSupabase,
  joinRoomSupabase,
  getRoomSupabase,
  getRoomsSupabase,
  getPlayersSupabase,
  deleteRoomSupabase,
  updateRoomStatusSupabase,
  sendMessageSupabase,
  getMessagesSupabase,
  subscribeToRoomSupabase,
  subscribeToPlayersSupabase,
  subscribeToMessagesSupabase,
  SQL_TABLES
};
