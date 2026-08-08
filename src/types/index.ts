export interface User {
  id: string;
  name: string;
  role: 'player' | 'master';
}

export interface GameRoom {
  id: string;
  code: string;
  password: string; // Добавляем пароль
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

export interface RoomService {
  createRoom(masterName: string, roomName?: string, password?: string): GameRoom;
  joinRoom(code: string, password: string, playerName: string): GameRoom | null;
  getRoom(code: string): GameRoom | null;
  getRooms(): GameRoom[];
  removeRoom(code: string): void;
}
