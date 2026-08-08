import { GameRoom, User } from '../types';

// Ключ для localStorage
const STORAGE_KEY = 'kpms_rooms';

// Загрузка комнат из localStorage
function loadRooms(): Map<string, GameRoom> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return new Map(Object.entries(data));
    }
  } catch (e) {
    console.error('Error loading rooms from storage:', e);
  }
  return new Map();
}

// Сохранение комнат в localStorage
function saveRooms(rooms: Map<string, GameRoom>): void {
  try {
    const data = Object.fromEntries(rooms);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving rooms to storage:', e);
  }
}

// Хранилище комнат
let rooms: Map<string, GameRoom> = loadRooms();

// Генерация уникального 6-значного кода
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Создание новой комнаты
export function createRoom(masterName: string, roomName: string = 'Новая игра'): GameRoom {
  let code = generateRoomCode();
  
  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const room: GameRoom = {
    id: `room_${Date.now()}`,
    code: code,
    name: roomName,
    masterId: `user_${Date.now()}`,
    players: [
      {
        id: `user_${Date.now()}`,
        name: masterName,
        role: 'master'
      }
    ],
    createdAt: Date.now(),
    status: 'waiting'
  };

  rooms.set(code, room);
  saveRooms(rooms);
  return room;
}

// Присоединение к комнате
export function joinRoom(code: string, playerName: string): GameRoom | null {
  const room = rooms.get(code.toUpperCase());
  
  if (!room) {
    return null;
  }

  if (room.status === 'finished') {
    return null;
  }

  // Проверяем, не присоединен ли уже игрок с таким именем
  const existingPlayer = room.players.find(p => p.name === playerName);
  if (existingPlayer) {
    return null;
  }

  const newPlayer: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: playerName,
    role: 'player'
  };

  room.players.push(newPlayer);
  saveRooms(rooms);
  return room;
}

// Получение комнаты по коду
export function getRoom(code: string): GameRoom | null {
  const room = rooms.get(code.toUpperCase()) || null;
  return room;
}

// Получение всех комнат
export function getRooms(): GameRoom[] {
  return Array.from(rooms.values());
}

// Удаление комнаты
export function removeRoom(code: string): boolean {
  const result = rooms.delete(code.toUpperCase());
  if (result) {
    saveRooms(rooms);
  }
  return result;
}

// Проверка, существует ли комната
export function roomExists(code: string): boolean {
  return rooms.has(code.toUpperCase());
}

// Получение количества игроков в комнате
export function getPlayerCount(code: string): number {
  const room = rooms.get(code.toUpperCase());
  return room ? room.players.length : 0;
}

// Обновление статуса комнаты
export function updateRoomStatus(code: string, status: 'waiting' | 'playing' | 'finished'): boolean {
  const room = rooms.get(code.toUpperCase());
  if (!room) return false;
  
  room.status = status;
  saveRooms(rooms);
  return true;
}
