import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LogOut, Users, Map, Settings, BookOpen, Sparkles, 
  FlaskConical, Dice5, Copy, Check, Eye, Key, Lock, Unlock 
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
      <div className="min-h-screen flex items-center justify-center bg-krem">
        <div className="text-center">
          <p className="text-2xl font-serif mb-4">Комната не найдена</p>
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
    <div className="flex flex-col h-screen bg-krem">
      <header className="flex justify-between items-center px-6 py-3 border-b border-gold/20 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <span className="font-serif text-xl text-ink">KPMS</span>
          <span className="text-xs text-brown-dark/50 bg-gold/10 px-2 py-0.5 rounded-full">Мастер</span>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-brown-dark/60">Код:</span>
            <span className="font-mono font-bold text-lg text-gold bg-gold/10 px-3 py-1 rounded-lg">
              {room.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1 hover:bg-gold/10 rounded-lg transition-colors"
              title="Скопировать код"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-brown-dark/60" />}
            </button>
          </div>
          {room.password && (
            <div className="flex items-center space-x-1 text-xs">
              <Key className="w-3 h-3 text-amber-500" />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-brown-dark/40 hover:text-amber-500 transition-colors"
              >
                {showPassword ? room.password : '••••••'}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-brown-dark/60">
            <Users className="w-4 h-4" />
            <span>{room.players.length} игроков</span>
          </div>
          <Button variant="ghost" size="sm" className="text-brown-dark/60 hover:text-ink" onClick={handleEndGame}>
            <LogOut className="w-4 h-4 mr-1" /> Завершить
          </Button>
        </div>
      </header>

      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        <div className="w-16 bg-white/40 backdrop-blur-sm rounded-xl border border-gold/20 flex flex-col items-center py-4 space-y-4 shadow-lg">
          <button className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors" title="Игроки">
            <Users className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Карта">
            <Map className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Правила">
            <BookOpen className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Заклинания">
            <Sparkles className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Зелья">
            <FlaskConical className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Настройки">
            <Settings className="w-6 h-6" />
          </button>
          <div className="flex-1"></div>
          <button className="p-2 rounded-lg bg-gold text-white hover:bg-gold-dark transition-colors shadow-lg" title="Бросок">
            <Dice5 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 relative bg-brown-dark/5 rounded-xl border border-gold/20 shadow-inner overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-brown-dark/30">
            <div className="text-center">
              <p className="text-6xl mb-4">🗺️</p>
              <p className="font-serif text-2xl">{room.name}</p>
              <p className="text-sm">Карта Мастера</p>
              <p className="text-xs mt-2 text-brown-dark/20">Код комнаты: {room.code}</p>
              {room.password && (
                <p className="text-xs text-amber-500/40 mt-1">🔒 Комната защищена паролем</p>
              )}
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-gold/20 p-3 min-w-48 max-h-96 overflow-y-auto">
            <p className="text-xs font-semibold text-brown-dark/70 border-b border-gold/20 pb-1 mb-2 flex items-center justify-between">
              <span>Игроки ({room.players.length})</span>
              <span className="text-xs font-normal text-brown-dark/40">{characters.length} персонажей</span>
            </p>
            <div className="space-y-2">
              {room.players.map((player: any, index: number) => {
                const char = characters.find(c => c.userId === player.id);
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-1">
                      {player.role === 'master' && <span className="text-gold">👑</span>}
                      <span>{player.name}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      {char && (
                        <button
                          onClick={() => {
                            setSelectedCharacter(char);
                            setShowCharacterSheet(true);
                          }}
                          className="text-brown-dark/40 hover:text-gold transition-colors"
                          title="Просмотреть персонажа"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      )}
                      <span className={`w-2 h-2 rounded-full ${player.role === 'master' ? 'bg-gold' : 'bg-green-500'}`}></span>
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
