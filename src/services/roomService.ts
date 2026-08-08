import { GameRoom, User } from '../types';

// Хранилище комнат в памяти
let rooms: Map<string, GameRoom> = new Map();

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
  
  // Убеждаемся, что код уникален
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
    id: `user_${Date.now()}_${Math.random()}`,
    name: playerName,
    role: 'player'
  };

  room.players.push(newPlayer);
  return room;
}

// Получение комнаты по коду
export function getRoom(code: string): GameRoom | null {
  return rooms.get(code.toUpperCase()) || null;
}

// Получение всех комнат
export function getRooms(): GameRoom[] {
  return Array.from(rooms.values());
}

// Удаление комнаты
export function removeRoom(code: string): boolean {
  return rooms.delete(code.toUpperCase());
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
