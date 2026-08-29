export interface User {
  id: string;
  name: string;
  role: 'master' | 'player';
}

export interface GameRoom {
  id: string;
  code: string;
  password: string;
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
