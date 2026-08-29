import { useState, useEffect, useCallback } from 'react';
import { 
  initPeer, getPeer, getMyId, setRoomCode,
  setIsMaster, getIsMaster, connectToPlayer, sendToAll,
  onConnection, onMessage, closeAllConnections,
  isConnected, getConnectionCount
} from '../services/peerService';

interface MultiplayerState {
  isConnected: boolean;
  playerCount: number;
  myId: string;
  roomCode: string;
  isMaster: boolean;
  players: string[];
}

export function useMultiplayer(roomCode: string, userName: string, role: 'master' | 'player') {
  const [state, setState] = useState<MultiplayerState>({
    isConnected: false,
    playerCount: 0,
    myId: '',
    roomCode: roomCode,
    isMaster: role === 'master',
    players: []
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [playersList, setPlayersList] = useState<string[]>([]);

  useEffect(() => {
    const id = `${role}_${userName}_${Date.now()}`;
    initPeer(id);
    setRoomCode(roomCode);
    setIsMaster(role === 'master');

    setState(prev => ({ ...prev, myId: id, isConnected: true }));

    if (role === 'master') {
      onConnection((conn) => {
        setPlayersList(prev => [...prev, conn.peer]);
        conn.on('open', () => {
          conn.send({ type: 'init', data: { roomCode: roomCode, players: playersList } });
        });
      });
    }

    return () => { closeAllConnections(); };
  }, [roomCode, role, userName]);

  const sendMessage = useCallback((type: string, data: any) => {
    const message = { type, data, sender: getMyId(), timestamp: Date.now() };
    sendToAll(message);
    setMessages(prev => [...prev, message]);
  }, []);

  useEffect(() => {
    const handleMessage = (data: any) => {
      setMessages(prev => [...prev, data]);
      if (data.type === 'player_joined') setPlayersList(prev => [...prev, data.sender]);
      if (data.type === 'player_left') setPlayersList(prev => prev.filter(id => id !== data.sender));
    };

    const peer = getPeer();
    if (peer) {
      peer.on('connection', (conn) => { onMessage(conn, handleMessage); });
    }

    return () => {};
  }, []);

  const connectToMaster = useCallback(async (masterId: string) => {
    try {
      const conn = await connectToPlayer(masterId);
      setState(prev => ({ ...prev, isConnected: true }));
      conn.send({ type: 'player_joined', sender: getMyId(), data: { name: userName } });
      return true;
    } catch (error) {
      console.error('Ошибка подключения к мастеру:', error);
      return false;
    }
  }, [userName]);

  return {
    ...state,
    playersList,
    messages,
    sendMessage,
    connectToMaster,
    isConnected: state.isConnected,
    playerCount: playersList.length + 1
  };
}
