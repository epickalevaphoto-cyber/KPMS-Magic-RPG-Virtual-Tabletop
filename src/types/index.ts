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
}

export interface Character {
  id: string;
  name: string;
  userId: string;
}
