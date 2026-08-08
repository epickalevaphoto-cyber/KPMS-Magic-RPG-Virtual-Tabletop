import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Users, Plus, LogIn, X, List, Copy, Trash2, AlertCircle, Key, Lock, Unlock, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { createRoom, joinRoom, getRooms, removeRoom, clearAllRooms, removeOldRooms } from '../services/roomService';

const BACKGROUND_IMAGE = 'https://i.pinimg.com/1200x/45/61/46/456146dc3b37b62b8f3c23cb903cf751.jpg';

// Получаем ID мастера из localStorage (устанавливается при создании комнаты)
const getMasterId = (): string | null => {
  return localStorage.getItem('kpms_master_id');
};

const setMasterId = (id: string): void => {
  localStorage.setItem('kpms_master_id', id);
};

const clearMasterId = (): void => {
  localStorage.removeItem('kpms_master_id');
};

const Home = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [masterName, setMasterName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [currentMasterId, setCurrentMasterId] = useState<string | null>(getMasterId());

  useEffect(() => {
    const loadRooms = () => {
      const allRooms = getRooms();
      setRooms(allRooms);
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

    const room = createRoom(masterName.trim(), roomName.trim() || 'Новая игра', roomPassword.trim());
    
    // Сохраняем ID мастера
    setMasterId(room.masterId);
    setCurrentMasterId(room.masterId);
    
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

    const room = joinRoom(roomCode.trim(), joinPassword.trim(), playerName.trim());
    
    if (!room) {
      setError('Комната не найдена, пароль неверный или уже завершена');
      return;
    }

    setShowJoinModal(false);
    setError('');
    navigate(`/player/${room.code}`);
  };

  const handleJoinFromList = (code: string) => {
    setRoomCode(code);
    setJoinPassword(''); // Очищаем пароль, чтобы игрок ввел его сам
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
    // Только мастер может удалить все комнаты
    if (!currentMasterId) {
      alert('Только мастер может удалять комнаты');
      return;
    }
    
    if (window.confirm('Вы уверены, что хотите удалить ВСЕ комнаты? Это действие нельзя отменить.')) {
      clearAllRooms();
      setRooms(getRooms());
      clearMasterId();
      setCurrentMasterId(null);
    }
  };

  const handleRemoveOldRooms = () => {
    // Только мастер может удалять старые комнаты
    if (!currentMasterId) {
      alert('Только мастер может удалять комнаты');
      return;
    }
    
    const removed = removeOldRooms(24);
    setRooms(getRooms());
    if (removed > 0) {
      alert(`Удалено ${removed} старых комнат (старше 24 часов)`);
    } else {
      alert('Нет старых комнат для удаления');
    }
  };

  // Проверяем, может ли пользователь удалить комнату
  const canDeleteRoom = (room: any): boolean => {
    // Только мастер, создавший комнату, может ее удалить
    return currentMasterId === room.masterId;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-pattern">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${BACKGROUND_IMAGE}")`,
          filter: 'blur(6px)',
          transform: 'scale(1.05)',
        }}
      />
      
      <div className="absolute inset-0 bg-soft-ivory/75 backdrop-blur-[2px]" />

      <div className="text-center max-w-3xl mx-auto px-4 py-12 relative z-10">
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-caramel/10 flex items-center justify-center">
              <Shield className="w-10 h-10 text-caramel" />
            </div>
          </div>
          <h1 className="font-serif text-7xl md:text-8xl font-bold text-dark-chocolate tracking-wider mb-2 magic-text">
            КПМБ
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-caramel to-transparent mx-auto my-4"></div>
          <p className="text-lg md:text-xl text-walnut/80 font-light tracking-[0.2em] uppercase">
            Клуб Прикладной Магической Безопасности
          </p>
          <p className="text-sm text-walnut/50 mt-2 tracking-wider">
            Magic RPG Virtual Tabletop
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-caramel/60 animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-caramel/40 animate-pulse delay-200"></span>
            <span className="w-2 h-2 rounded-full bg-caramel/20 animate-pulse delay-400"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="flex flex-col items-center justify-center p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-caramel/20 hover:border-caramel/60 transform hover:-translate-y-1">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-caramel/10 to-caramel/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-10 h-10 text-caramel" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-dark-chocolate mb-2">Создать игру</h2>
            <p className="text-walnut/70 text-sm mb-6">Начните новое приключение</p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => setShowCreateModal(true)}>
              <Wand2 className="w-5 h-5 mr-2" />
              Создать
            </Button>
          </Card>

          <Card className="flex flex-col items-center justify-center p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-caramel/20 hover:border-caramel/60 transform hover:-translate-y-1">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-caramel/10 to-caramel/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LogIn className="w-10 h-10 text-caramel" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-dark-chocolate mb-2">Войти в игру</h2>
            <p className="text-walnut/70 text-sm mb-6">Присоединиться к сессии</p>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => setShowJoinModal(true)}>
              <Users className="w-5 h-5 mr-2" />
              Войти
            </Button>
          </Card>
        </div>

        <div className="mt-6 flex flex-col items-center space-y-2">
          <button
            onClick={() => setShowRoomList(!showRoomList)}
            className="text-sm text-walnut/50 hover:text-caramel transition-colors flex items-center justify-center mx-auto space-x-2 bg-soft-ivory/30 backdrop-blur-sm px-4 py-2 rounded-full border border-caramel/20 hover:border-caramel/40"
          >
            <List className="w-4 h-4" />
            <span>Активные комнаты ({rooms.length})</span>
          </button>

          {rooms.length > 0 && currentMasterId && (
            <div className="flex items-center space-x-4 text-xs">
              <button
                onClick={handleRemoveOldRooms}
                className="text-walnut/40 hover:text-caramel transition-colors"
              >
                🕐 Удалить старые (24ч)
              </button>
              <button
                onClick={handleClearAllRooms}
                className="text-red-400/60 hover:text-red-600 transition-colors"
              >
                🗑️ Удалить все
              </button>
            </div>
          )}
        </div>

        {showRoomList && (
          <div className="mt-4 bg-soft-ivory/90 backdrop-blur-md rounded-xl shadow-xl border border-caramel/20 p-4 max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-semibold text-dark-chocolate/70">Активные комнаты:</h3>
              <span className="text-xs text-walnut/40">{rooms.length} комнат</span>
            </div>
            {rooms.length === 0 ? (
              <p className="text-sm text-walnut/40">Нет активных комнат</p>
            ) : (
              <div className="space-y-2">
                {rooms.map((room, index) => {
                  const isMaster = canDeleteRoom(room);
                  return (
                    <div key={index} className="flex items-center justify-between bg-vanilla-cream/30 rounded-lg px-4 py-2 hover:bg-vanilla-cream/50 transition-colors">
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-caramel">{room.code}</span>
                          {room.password ? (
                            <Lock className="w-3 h-3 text-amber-500" />
                          ) : (
                            <Unlock className="w-3 h-3 text-green-500" />
                          )}
                          {isMaster && (
                            <span className="text-[10px] text-caramel/60 bg-caramel/10 px-1.5 py-0.5 rounded-full">
                              👑 Мастер
                            </span>
                          )}
                          <span className="text-xs text-walnut/40">
                            {new Date(room.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-xs text-walnut/60">{room.name}</div>
                        <div className="text-xs text-walnut/40">Игроков: {room.players.length}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyCode(room.code)}
                          className="p-1 text-walnut/40 hover:text-caramel transition-colors"
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
                        {isMaster && (
                          <button
                            onClick={() => setShowConfirmDelete(room.code)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            title="Удалить комнату"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-walnut/30 text-xs tracking-widest">
          <span>✦ v0.2.1 ✦</span>
        </div>
      </div>

      {/* Модальное окно создания комнаты */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-soft-ivory rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-semibold text-dark-chocolate">✨ Создать игру</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Ваше имя</label>
                <input
                  type="text"
                  value={masterName}
                  onChange={(e) => setMasterName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Название комнаты (опционально)</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Новая игра"
                  className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate/80 mb-1 flex items-center">
                  <Key className="w-4 h-4 mr-1 text-caramel" />
                  Пароль комнаты (опционально)
                </label>
                <input
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Оставьте пустым для открытой комнаты"
                  className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
                />
                <p className="text-xs text-walnut/40 mt-1">Игроки должны будут ввести этот пароль для входа</p>
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

      {/* Модальное окно присоединения */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowJoinModal(false)}>
          <div className="bg-soft-ivory rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-semibold text-dark-chocolate">🔑 Войти в игру</h3>
              <button onClick={() => setShowJoinModal(false)} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Ваше имя</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Код комнаты</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Например: ABC123"
                  className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory uppercase"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate/80 mb-1 flex items-center">
                  <Key className="w-4 h-4 mr-1 text-caramel" />
                  Пароль комнаты
                </label>
                <input
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Введите пароль (если установлен)"
                  className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
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

      {/* Модальное окно подтверждения удаления */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-soft-ivory rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h3 className="font-serif text-xl font-semibold text-dark-chocolate">Удалить комнату?</h3>
            </div>
            <p className="text-sm text-walnut/70 mb-6">
              Вы уверены, что хотите удалить комнату <span className="font-mono font-bold text-caramel">{showConfirmDelete}</span>?
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
    </div>
  );
};

export default Home;
