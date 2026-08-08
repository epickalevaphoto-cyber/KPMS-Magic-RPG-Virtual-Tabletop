import { GameRoom, User } from '../types';

const STORAGE_KEY = 'kpms_rooms';

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

function saveRooms(rooms: Map<string, GameRoom>): void {
  try {
    const data = Object.fromEntries(rooms);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving rooms to storage:', e);
  }
}

let rooms: Map<string, GameRoom> = loadRooms();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createRoom(masterName: string, roomName: string = 'Новая игра', password: string = ''): GameRoom {
  let code = generateRoomCode();
  
  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const room: GameRoom = {
    id: `room_${Date.now()}`,
    code: code,
    password: password.trim() || '',
    name: roomName,
    masterId: `master_${Date.now()}`,
    players: [
      {
        id: `master_${Date.now()}`,
        name: masterName.trim(),
        role: 'master'
      }
    ],
    createdAt: Date.now(),
    status: 'waiting'
  };

  rooms.set(code, room);
  saveRooms(rooms);
  console.log('✅ Room created:', { code, room });
  return room;
}

export function joinRoom(code: string, password: string, playerName: string): GameRoom | null {
  const room = rooms.get(code.toUpperCase());
  
  console.log('🔍 Attempting to join room:', { code: code.toUpperCase(), roomExists: !!room });
  
  if (!room) {
    console.log('❌ Room not found');
    return null;
  }

  if (room.status === 'finished') {
    console.log('❌ Room is finished');
    return null;
  }

  // Проверяем пароль
  if (room.password && room.password !== password.trim()) {
    console.log('❌ Wrong password');
    return null;
  }

  const existingPlayer = room.players.find(p => p.name === playerName.trim());
  if (existingPlayer) {
    console.log('❌ Player with same name already exists:', playerName);
    return null;
  }

  const newPlayer: User = {
    id: `player_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: playerName.trim(),
    role: 'player'
  };

  room.players.push(newPlayer);
  saveRooms(rooms);
  console.log('✅ Player joined:', { player: newPlayer, totalPlayers: room.players.length });
  return room;
}

export function getRoom(code: string): GameRoom | null {
  const room = rooms.get(code.toUpperCase()) || null;
  console.log('🔍 Getting room:', { code: code.toUpperCase(), found: !!room });
  return room;
}

export function getRooms(): GameRoom[] {
  return Array.from(rooms.values());
}

export function removeRoom(code: string): boolean {
  const result = rooms.delete(code.toUpperCase());
  if (result) {
    saveRooms(rooms);
    console.log('🗑️ Room removed:', code);
  }
  return result;
}

export function clearAllRooms(): void {
  rooms.clear();
  saveRooms(rooms);
  console.log('🗑️ All rooms cleared');
}

export function removeOldRooms(maxAgeHours: number = 24): number {
  const now = Date.now();
  const maxAge = maxAgeHours * 60 * 60 * 1000;
  let removed = 0;
  
  for (const [code, room] of rooms) {
    if (now - room.createdAt > maxAge) {
      rooms.delete(code);
      removed++;
    }
  }
  
  if (removed > 0) {
    saveRooms(rooms);
    console.log(`🗑️ Removed ${removed} old rooms`);
  }
  
  return removed;
}

export function roomExists(code: string): boolean {
  return rooms.has(code.toUpperCase());
}

export function getPlayerCount(code: string): number {
  const room = rooms.get(code.toUpperCase());
  return room ? room.players.length : 0;
}

export function updateRoomStatus(code: string, status: 'waiting' | 'playing' | 'finished'): boolean {
  const room = rooms.get(code.toUpperCase());
  if (!room) return false;
  
  room.status = status;
  saveRooms(rooms);
  return true;
}

export function updateRoomPassword(code: string, newPassword: string): boolean {
  const room = rooms.get(code.toUpperCase());
  if (!room) return false;
  
  room.password = newPassword.trim() || '';
  saveRooms(rooms);
  return true;
}
