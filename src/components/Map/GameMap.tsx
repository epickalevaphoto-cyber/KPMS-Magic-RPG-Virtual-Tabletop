import { useState, useRef, useEffect } from 'react';
import { Upload, Move, ZoomIn, ZoomOut, Plus, X, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';

interface Token {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
  size: number;
}

interface GameMapProps {
  roomCode: string;
  isMaster?: boolean;
  tokens?: Token[];
  onTokenMove?: (tokenId: string, x: number, y: number) => void;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8A80', '#82B1FF'];

const GameMap = ({ roomCode, isMaster = false, tokens = [], onTokenMove }: GameMapProps) => {
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragToken, setDragToken] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [localTokens, setLocalTokens] = useState<Token[]>(tokens);
  const [fogOfWar, setFogOfWar] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Загрузка карты из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`map_${roomCode}`);
    if (saved) {
      setMapImage(saved);
    }
    const savedTokens = localStorage.getItem(`tokens_${roomCode}`);
    if (savedTokens) {
      setLocalTokens(JSON.parse(savedTokens));
    }
  }, [roomCode]);

  // Сохранение карты
  const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setMapImage(dataUrl);
      localStorage.setItem(`map_${roomCode}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Добавление токена
  const addToken = (name: string) => {
    const newToken: Token = {
      id: `token_${Date.now()}`,
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
      name: name || `Персонаж ${localTokens.length + 1}`,
      color: COLORS[localTokens.length % COLORS.length],
      size: 30
    };
    const updated = [...localTokens, newToken];
    setLocalTokens(updated);
    localStorage.setItem(`tokens_${roomCode}`, JSON.stringify(updated));
    if (onTokenMove) onTokenMove(newToken.id, newToken.x, newToken.y);
  };

  // Удаление токена
  const removeToken = (id: string) => {
    const updated = localTokens.filter(t => t.id !== id);
    setLocalTokens(updated);
    localStorage.setItem(`tokens_${roomCode}`, JSON.stringify(updated));
    if (selectedToken === id) setSelectedToken(null);
  };

  // Перемещение токена
  const handleMouseDown = (e: React.MouseEvent, tokenId: string) => {
    if (!isMaster) return;
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const token = localTokens.find(t => t.id === tokenId);
    if (!token) return;
    setDragToken(tokenId);
    setDragOffset({
      x: e.clientX - rect.left - token.x * rect.width / 100,
      y: e.clientY - rect.top - token.y * rect.height / 100
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragToken || !isMaster) return;
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    const updated = localTokens.map(t =>
      t.id === dragToken ? { ...t, x: clampedX, y: clampedY } : t
    );
    setLocalTokens(updated);
    localStorage.setItem(`tokens_${roomCode}`, JSON.stringify(updated));
    if (onTokenMove) onTokenMove(dragToken, clampedX, clampedY);
  };

  const handleMouseUp = () => {
    setDragToken(null);
  };

  // Очистка карты
  const clearMap = () => {
    localStorage.removeItem(`map_${roomCode}`);
    localStorage.removeItem(`tokens_${roomCode}`);
    setMapImage(null);
    setLocalTokens([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Панель управления */}
      <div className="flex items-center gap-2 p-2 bg-soft-ivory/80 rounded-t-xl border border-caramel/20 flex-wrap">
        {isMaster && (
          <>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-1" /> Карта
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMapUpload} className="hidden" />
            <Button variant="secondary" size="sm" onClick={() => addToken('Персонаж')}>
              <Plus className="w-4 h-4 mr-1" /> Токен
            </Button>
            <button
              onClick={() => setFogOfWar(!fogOfWar)}
              className={`p-2 rounded-lg transition-colors ${fogOfWar ? 'bg-caramel/20 text-caramel' : 'text-walnut/60 hover:bg-caramel/10'}`}
              title="Туман войны"
            >
              {fogOfWar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <Button variant="ghost" size="sm" onClick={clearMap} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
        <div className="flex-1"></div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 text-walnut/60 hover:text-caramel">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-walnut/60 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1 text-walnut/60 hover:text-caramel">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Карта */}
      <div
        ref={mapContainerRef}
        className="flex-1 relative bg-walnut/10 rounded-b-xl border border-caramel/20 overflow-hidden"
        style={{ minHeight: '300px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {mapImage ? (
          <div className="relative w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <img src={mapImage} alt="Игровая карта" className="w-full h-full object-contain" />
            {/* Токены */}
            {localTokens.map(token => (
              <div
                key={token.id}
                className={`absolute rounded-full cursor-${isMaster ? 'grab' : 'default'} flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform hover:scale-110`}
                style={{
                  left: `${token.x}%`,
                  top: `${token.y}%`,
                  width: `${token.size}px`,
                  height: `${token.size}px`,
                  backgroundColor: token.color,
                  transform: 'translate(-50%, -50%)',
                  zIndex: selectedToken === token.id ? 10 : 1
                }}
                onMouseDown={(e) => handleMouseDown(e, token.id)}
                onClick={() => setSelectedToken(token.id === selectedToken ? null : token.id)}
              >
                {token.name[0]?.toUpperCase() || '?'}
              </div>
            ))}
            {/* Туман войны */}
            {fogOfWar && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none">
                <p className="text-white/30 text-sm">🌫️ Туман войны</p>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-walnut/30">
            <p className="text-6xl mb-4">🗺️</p>
            <p className="font-serif text-lg">Загрузите карту</p>
            {isMaster && <p className="text-sm mt-2">Нажмите "Карта" чтобы загрузить изображение</p>}
          </div>
        )}
      </div>

      {/* Список токенов */}
      {isMaster && localTokens.length > 0 && (
        <div className="p-2 bg-soft-ivory/80 rounded-b-xl border border-caramel/20 flex flex-wrap gap-1">
          {localTokens.map(t => (
            <span key={t.id} className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></span>
              {t.name}
              <button onClick={() => removeToken(t.id)} className="text-red-400 hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameMap;
