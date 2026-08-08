import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LogOut, Users, Map, Settings, BookOpen, Sparkles, 
  FlaskConical, Dice5, Copy, Check, Eye, Key 
} from 'lucide-react';
import Button from '../components/ui/Button';
import CharacterSheet from '../components/character/CharacterSheet';
import { getRoom, removeRoom } from '../services/roomService';
import { getCharactersByRoom } from '../services/characterService';
import { Character } from '../types/character';

const Master = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (code) {
      const currentRoom = getRoom(code);
      setRoom(currentRoom);
      
      if (!currentRoom) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [code, navigate]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-ivory">
        <div className="text-center">
          <p className="text-2xl font-serif text-dark-chocolate mb-4">Комната не найдена</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndGame = () => {
    if (window.confirm('Вы уверены, что хотите завершить игру?')) {
      removeRoom(room.code);
      navigate('/');
    }
  };

  const characters = getCharactersByRoom(room.id);

  return (
    <div className="flex flex-col h-screen bg-soft-ivory">
      <header className="flex justify-between items-center px-6 py-3 border-b border-caramel/20 bg-soft-ivory/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <span className="font-serif text-xl text-dark-chocolate">КПМБ</span>
          <span className="text-xs text-walnut/50 bg-caramel/10 px-2 py-0.5 rounded-full">Мастер</span>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-walnut/60">Код:</span>
            <span className="font-mono font-bold text-lg text-caramel bg-caramel/10 px-3 py-1 rounded-lg">
              {room.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1 hover:bg-caramel/10 rounded-lg transition-colors"
              title="Скопировать код"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-walnut/60" />}
            </button>
          </div>
          {room.password && (
            <div className="flex items-center space-x-1 text-xs">
              <Key className="w-3 h-3 text-amber-500" />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-walnut/40 hover:text-amber-500 transition-colors"
              >
                {showPassword ? room.password : '••••••'}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-walnut/60">
            <Users className="w-4 h-4" />
            <span>{room.players.length} игроков</span>
          </div>
          <Button variant="ghost" size="sm" className="text-walnut/60 hover:text-dark-chocolate" onClick={handleEndGame}>
            <LogOut className="w-4 h-4 mr-1" /> Завершить
          </Button>
        </div>
      </header>

      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        <div className="w-16 bg-soft-ivory/80 backdrop-blur-sm rounded-xl border border-caramel/20 flex flex-col items-center py-4 space-y-4 shadow-lg">
          <button className="p-2 rounded-lg bg-caramel/10 text-caramel hover:bg-caramel/20 transition-colors" title="Игроки">
            <Users className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Карта">
            <Map className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Правила">
            <BookOpen className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Заклинания">
            <Sparkles className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Зелья">
            <FlaskConical className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Настройки">
            <Settings className="w-6 h-6" />
          </button>
          <div className="flex-1"></div>
          <button className="p-2 rounded-lg bg-caramel text-soft-ivory hover:bg-walnut transition-colors shadow-lg" title="Бросок">
            <Dice5 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 relative bg-walnut/5 rounded-xl border border-caramel/20 shadow-inner overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-walnut/30">
            <div className="text-center">
              <p className="text-6xl mb-4">🗺️</p>
              <p className="font-serif text-2xl text-dark-chocolate">{room.name}</p>
              <p className="text-sm text-walnut">Карта Мастера</p>
              <p className="text-xs mt-2 text-walnut/30">Код комнаты: {room.code}</p>
              {room.password && (
                <p className="text-xs text-amber-500/40 mt-1">🔒 Комната защищена паролем</p>
              )}
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-soft-ivory/80 backdrop-blur-sm rounded-lg shadow-lg border border-caramel/20 p-3 min-w-48 max-h-96 overflow-y-auto">
            <p className="text-xs font-semibold text-dark-chocolate/70 border-b border-caramel/20 pb-1 mb-2 flex items-center justify-between">
              <span>Игроки ({room.players.length})</span>
              <span className="text-xs font-normal text-walnut/40">{characters.length} персонажей</span>
            </p>
            <div className="space-y-2">
              {room.players.map((player: any, index: number) => {
                const char = characters.find(c => c.userId === player.id);
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-1">
                      {player.role === 'master' && <span className="text-caramel">👑</span>}
                      <span className="text-dark-chocolate">{player.name}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      {char && (
                        <button
                          onClick={() => {
                            setSelectedCharacter(char);
                            setShowCharacterSheet(true);
                          }}
                          className="text-walnut/40 hover:text-caramel transition-colors"
                          title="Просмотреть персонажа"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      )}
                      <span className={`w-2 h-2 rounded-full ${player.role === 'master' ? 'bg-caramel' : 'bg-green-500'}`}></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showCharacterSheet && selectedCharacter && (
        <CharacterSheet
          character={selectedCharacter}
          onClose={() => {
            setShowCharacterSheet(false);
            setSelectedCharacter(null);
          }}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default Master;
