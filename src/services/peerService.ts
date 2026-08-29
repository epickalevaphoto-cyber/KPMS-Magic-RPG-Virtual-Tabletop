import { Peer, DataConnection } from 'peerjs';

let peer: Peer | null = null;
let connections: DataConnection[] = [];
let myId: string = '';
let isMaster: boolean = false;
let roomCode: string = '';

export function initPeer(id: string): Peer {
  myId = id;
  peer = new Peer(id);
  return peer;
}

export function getPeer(): Peer | null { return peer; }
export function getMyId(): string { return myId; }
export function setRoomCode(code: string) { roomCode = code; }
export function getRoomCode(): string { return roomCode; }
export function setIsMaster(value: boolean) { isMaster = value; }
export function getIsMaster(): boolean { return isMaster; }

export function connectToPlayer(playerId: string): Promise<DataConnection> {
  return new Promise((resolve, reject) => {
    if (!peer) { reject('Peer не инициализирован'); return; }
    const conn = peer.connect(playerId);
    conn.on('open', () => { connections.push(conn); resolve(conn); });
    conn.on('error', (err) => { reject(err); });
  });
}

export function getConnections(): DataConnection[] { return connections; }

export function sendToAll(data: any) {
  connections.forEach(conn => { if (conn.open) conn.send(data); });
}

export function onConnection(callback: (conn: DataConnection) => void) {
  if (!peer) return;
  peer.on('connection', (conn) => { connections.push(conn); callback(conn); });
}

export function onMessage(conn: DataConnection, callback: (data: any) => void) {
  conn.on('data', (data) => { callback(data); });
}

export function closeAllConnections() {
  connections.forEach(conn => { if (conn.open) conn.close(); });
  connections = [];
  if (peer) { peer.destroy(); peer = null; }
}

export function isConnected(): boolean {
  return connections.some(c => c.open);
}

export function getConnectionCount(): number {
  return connections.filter(c => c.open).length;
}
