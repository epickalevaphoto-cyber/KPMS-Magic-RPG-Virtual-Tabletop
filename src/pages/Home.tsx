import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Users, Plus, LogIn, X, List, Copy, Trash2, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { createRoom, joinRoom, getRooms, removeRoom, clearAllRooms, removeOldRooms } from '../services/roomService';

const Home = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [masterName, setMasterName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadRooms = () => {
      const allRooms = getRooms();
      setRooms(allRooms);
      console.log('📋 Все комнаты:', allRooms);
    };
    loadRooms();
    
    const interval = setInterval(loadRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = () => {
    if (!masterName.trim()) {
      setError('Введите ваше имя');
      return;
    }

    const room = createRoom(masterName.trim(), roomName.trim() || 'Новая игра');
    console.log('✅ Room created:', { code: room.code, name: room.name });
    setShowCreateModal(false);
    setError('');
    navigate(`/master/${room.code}`);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Введите ваше имя');
      return;
    }

    if (!roomCode.trim()) {
      setError('Введите код комнаты');
      return;
    }

    console.log('🔍 Trying to join room with code:', roomCode.trim().toUpperCase());
    const room = joinRoom(roomCode.trim(), playerName.trim());
    
    if (!room) {
      setError('Комната не найдена или уже завершена. Проверьте код комнаты.');
      console.log('❌ Failed to join room');
      return;
    }

    console.log('✅ Joined room successfully:', { roomCode: room.code, player: playerName });
    setShowJoinModal(false);
    setError('');
    navigate(`/player/${room.code}`);
  };

  const handleJoinFromList = (code: string) => {
    setRoomCode(code);
    setShowRoomList(false);
    setShowJoinModal(true);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDeleteRoom = (code: string) => {
    removeRoom(code);
    setRooms(getRooms());
    setShowConfirmDelete(null);
  };

  const handleClearAllRooms = () => {
    if (window.confirm('Вы уверены, что хотите удалить ВСЕ комнаты? Это действие нельзя отменить.')) {
      clearAllRooms();
      setRooms(getRooms());
    }
  };

  const handleRemoveOldRooms = () => {
    const removed = removeOldRooms(24);
    setRooms(getRooms());
    if (removed > 0) {
      alert(`Удалено ${removed} старых комнат (старше 24 часов)`);
    } else {
      alert('Нет старых комнат для удаления');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-krem">
      <div className="text-center max-w-3xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-serif text-7xl md:text-8xl font-bold text-ink tracking-wider mb-2 magic-text">
            KPMS
          </h1>
          <div className="w-24 h-0.5 bg-gold mx-auto my-4"></div>
          <p className="text-lg md:text-xl text-brown-dark/80 font-light tracking-widest uppercase">
            Magic RPG Virtual Tabletop
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="flex flex-col items-center justify-center p-8 hover:shadow-2xl transition-shadow duration-300 cursor-pointer group border-gold/20 hover:border-gold/60">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <Plus className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-2">Создать игру</h2>
            <p className="text-brown-dark/70 text-sm mb-6">Начните новое приключение</p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => setShowCreateModal(true)}>
              Создать
            </Button>
          </Card>

          <Card className="flex flex-col items-center justify-center p-8 hover:shadow-2xl transition-shadow duration-300 cursor-pointer group border-gold/20 hover:border-gold/60">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <LogIn className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-2">Войти в игру</h2>
            <p className="text-brown-dark/70 text-sm mb-6">Присоединиться к сессии</p>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => setShowJoinModal(true)}>
              Войти
            </Button>
          </Card>
        </div>

        {/* Управление комнатами */}
        <div className="mt-6 flex flex-col items-center space-y-2">
          <button
            onClick={() => setShowRoomList(!showRoomList)}
            className="text-sm text-brown-dark/50 hover:text-gold transition-colors flex items-center justify-center mx-auto space-x-2"
          >
            <List className="w-4 h-4" />
            <span>Показать активные комнаты ({rooms.length})</span>
          </button>

          {rooms.length > 0 && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRemoveOldRooms}
                className="text-xs text-brown-dark/40 hover:text-gold transition-colors"
              >
                Удалить старые (24ч)
              </button>
              <button
                onClick={handleClearAllRooms}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Удалить все
              </button>
            </div>
          )}
        </div>

        {/* Список активных комнат */}
        {showRoomList && (
          <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gold/20 p-4 max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-semibold text-brown-dark/70">Активные комнаты:</h3>
              <span className="text-xs text-brown-dark/40">{rooms.length} комнат</span>
            </div>
            {rooms.length === 0 ? (
              <p className="text-sm text-brown-dark/40">Нет активных комнат</p>
            ) : (
              <div className="space-y-2">
                {rooms.map((room, index) => (
                  <div key={index} className="flex items-center justify-between bg-krem/30 rounded-lg px-4 py-2 hover:bg-krem/50 transition-colors">
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gold">{room.code}</span>
                        <span className="text-xs text-brown-dark/40">
                          {new Date(room.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs text-brown-dark/60">{room.name}</div>
                      <div className="text-xs text-brown-dark/40">Игроков: {room.players.length}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyCode(room.code)}
                        className="p-1 text-brown-dark/40 hover:text-gold transition-colors"
                        title="Скопировать код"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleJoinFromList(room.code)}
                      >
                        Войти
                      </Button>
                      <button
                        onClick={() => setShowConfirmDelete(room.code)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Удалить комнату"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-brown-dark/40 text-sm tracking-wider">
          <span>✦ Версия 0.2 ✦</span>
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h3 className="font-serif text-xl font-semibold">Удалить комнату?</h3>
            </div>
            <p className="text-sm text-brown-dark/70 mb-6">
              Вы уверены, что хотите удалить комнату <span className="font-mono font-bold text-gold">{showConfirmDelete}</span>?
              Это действие нельзя отменить.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowConfirmDelete(null)}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={() => handleDeleteRoom(showConfirmDelete)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания комнаты */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-semibold">Создать игру</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-brown-dark/50 hover:text-brown-dark transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown-dark/80 mb-1">Ваше имя</label>
                <input
                  type="text"
                  value={masterName}
                  onChange={(e) => setMasterName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-dark/80 mb-1">Название комнаты (опционально)</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Новая игра"
                  className="w-full px-4 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Button variant="primary" size="lg" className="w-full" onClick={handleCreateRoom}>
                <Wand2 className="w-5 h-5 mr-2" />
                Создать
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно присоединения к комнате */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowJoinModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-semibold">Войти в игру</h3>
              <button onClick={() => setShowJoinModal(false)} className="text-brown-dark/50 hover:text-brown-dark transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown-dark/80 mb-1">Ваше имя</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-dark/80 mb-1">Код комнаты</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Например: ABC123"
                  className="w-full px-4 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors uppercase"
                  maxLength={6}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Button variant="primary" size="lg" className="w-full" onClick={handleJoinRoom}>
                <Users className="w-5 h-5 mr-2" />
                Войти
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
