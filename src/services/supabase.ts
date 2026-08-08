import { createClient } from '@supabase/supabase-js';

// ============================================
// 1. ПОДКЛЮЧЕНИЕ К SUPABASE
// ============================================

// Загружаем переменные окружения из .env файла
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Проверяем, что переменные заданы
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase не настроен! Проверьте переменные окружения:\n' +
    '   - VITE_SUPABASE_URL\n' +
    '   - VITE_SUPABASE_ANON_KEY\n\n' +
    '   Создайте файл .env в корне проекта и добавьте:\n' +
    '   VITE_SUPABASE_URL=https://ваш-проект.supabase.co\n' +
    '   VITE_SUPABASE_ANON_KEY=ваш-anon-ключ\n\n' +
    '   Приложение будет работать в локальном режиме (localStorage).'
  );
}

// Создаем клиент Supabase (или заглушку, если нет переменных)
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

// ============================================
// 3. ТАБЛИЦЫ БАЗЫ ДАННЫХ
// ============================================

// SQL для создания таблиц (выполнить в Supabase SQL Editor)
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

-- Включаем Realtime для таблиц
ALTER TABLE rooms REPLICA IDENTITY FULL;
ALTER TABLE players REPLICA IDENTITY FULL;
ALTER TABLE chat_messages REPLICA IDENTITY FULL;
ALTER TABLE rolls REPLICA IDENTITY FULL;

-- Создаем индексы для ускорения запросов
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
CREATE INDEX IF NOT EXISTS idx_players_room_code ON players(room_code);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_code ON chat_messages(room_code);
CREATE INDEX IF NOT EXISTS idx_rolls_room_code ON rolls(room_code);
`;

// ============================================
// 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

// Проверка, подключен ли Supabase
export const isSupabaseConnected = (): boolean => {
  return supabase !== null;
};

// Получение статуса подключения
export const getSupabaseStatus = (): { connected: boolean; message: string } => {
  if (supabase) {
    return { connected: true, message: '✅ Supabase подключен' };
  }
  return { 
    connected: false, 
    message: '⚠️ Supabase не настроен. Работа в локальном режиме.'
  };
};

// ============================================
// 5. ФУНКЦИИ ДЛЯ РАБОТЫ С КОМНАТАМИ
// ============================================

// Создание комнаты
export async function createRoomSupabase(
  masterName: string,
  roomName: string = 'Новая игра',
  password: string = ''
): Promise<{ room: Room | null; error: string | null }> {
  if (!supabase) {
    return { room: null, error: 'Supabase не подключен' };
  }

  try {
    // Генерируем код
    const code = generateRoomCode();
    
    // Создаем комнату
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

    // Добавляем мастера как игрока
    const { error: playerError } = await supabase
      .from('players')
      .insert({
        room_code: code,
        user_id: room.master_id,
        name: masterName,
        role: 'master'
      });

    if (playerError) throw playerError;

    return { room, error: null };
  } catch (error: any) {
    console.error('❌ Ошибка создания комнаты:', error);
    return { room: null, error: error.message || 'Ошибка создания комнаты' };
  }
}

// Присоединение к комнате
export async function joinRoomSupabase(
  code: string,
  password: string,
  playerName: string
): Promise<{ room: Room | null; error: string | null }> {
  if (!supabase) {
    return { room: null, error: 'Supabase не подключен' };
  }

  try {
    // Проверяем комнату
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

    // Проверяем пароль
    if (room.password && room.password !== password) {
      return { room: null, error: 'Неверный пароль' };
    }

    // Проверяем, не занято ли имя
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('room_code', code.toUpperCase())
      .eq('name', playerName)
      .maybeSingle();

    if (existingPlayer) {
      return { room: null, error: 'Игрок с таким именем уже есть в комнате' };
    }

    // Добавляем игрока
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

// Получение комнаты по коду
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

// Получение всех комнат
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

// Получение игроков в комнате
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

// Удаление комнаты
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

// Обновление статуса комнаты
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

// Генерация кода комнаты
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ============================================
// 6. ФУНКЦИИ ДЛЯ ЧАТА
// ============================================

// Отправка сообщения
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
    return data;
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error);
    return null;
  }
}

// Получение сообщений
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
    return data || [];
  } catch (error) {
    console.error('❌ Ошибка получения сообщений:', error);
    return [];
  }
}

// ============================================
// 7. ФУНКЦИИ ДЛЯ БРОСКОВ
// ============================================

// Сохранение броска
export async function saveRollSupabase(
  roomCode: string,
  userId: string,
  userName: string,
  diceType: string,
  diceCount: number,
  modifier: number,
  results: number[],
  total: number
): Promise<Roll | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('rolls')
      .insert({
        room_code: roomCode.toUpperCase(),
        user_id: userId,
        user_name: userName,
        dice_type: diceType,
        dice_count: diceCount,
        modifier: modifier,
        results: results,
        total: total
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Ошибка сохранения броска:', error);
    return null;
  }
}

// Получение истории бросков
export async function getRollsSupabase(roomCode: string): Promise<Roll[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('rolls')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Ошибка получения бросков:', error);
    return [];
  }
}

// ============================================
// 8. ПОДПИСКИ В РЕАЛЬНОМ ВРЕМЕНИ (Realtime)
// ============================================

// Подписка на изменения комнаты
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
      onUpdate
    )
    .subscribe();

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    }
  };
}

// Подписка на игроков
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
      onUpdate
    )
    .subscribe();

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    }
  };
}

// Подписка на новые сообщения чата
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
      (payload) => {
        if (payload.new) {
          onNewMessage(payload.new as ChatMessage);
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

// Подписка на новые броски
export function subscribeToRollsSupabase(
  roomCode: string,
  onNewRoll: (roll: Roll) => void
) {
  if (!supabase) {
    console.warn('⚠️ Supabase не подключен, подписка недоступна');
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel(`rolls_${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'rolls',
        filter: `room_code=eq.${roomCode.toUpperCase()}`
      },
      (payload) => {
        if (payload.new) {
          onNewRoll(payload.new as Roll);
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
// 9. ЭКСПОРТ ВСЕХ ФУНКЦИЙ
// ============================================

export default {
  // Клиент
  supabase,
  isSupabaseConnected,
  getSupabaseStatus,
  
  // Комнаты
  createRoomSupabase,
  joinRoomSupabase,
  getRoomSupabase,
  getRoomsSupabase,
  getPlayersSupabase,
  deleteRoomSupabase,
  updateRoomStatusSupabase,
  
  // Чат
  sendMessageSupabase,
  getMessagesSupabase,
  
  // Броски
  saveRollSupabase,
  getRollsSupabase,
  
  // Подписки
  subscribeToRoomSupabase,
  subscribeToPlayersSupabase,
  subscribeToMessagesSupabase,
  subscribeToRollsSupabase,
  
  // SQL
  SQL_TABLES
};
