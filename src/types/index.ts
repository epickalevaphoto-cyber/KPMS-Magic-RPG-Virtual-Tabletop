export interface User {
  id: string;
  name: string;
  role: 'player' | 'master';
}

export interface GameRoom {
  id: string;
  code: string;
  name: string;
  masterId: string;
  players: User[];
  createdAt: number;
  status: 'waiting' | 'playing' | 'finished';
}

export interface Character {
  id: string;
  name: string;
  userId: string;
  roomId: string;
}

// Сервис для управления комнатами
export interface RoomService {
  createRoom(masterName: string, roomName?: string): GameRoom;
  joinRoom(code: string, playerName: string): GameRoom | null;
  getRoom(code: string): GameRoom | null;
  getRooms(): GameRoom[];
  removeRoom(code: string): void;
}
