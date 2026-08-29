import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LogOut, Users, Map, Settings, BookOpen, Sparkles, 
  FlaskConical, Dice5, Copy, Check, Key, FileText
} from 'lucide-react';
import Button from '../components/ui/Button';
import CharacterSheet from '../components/character/CharacterSheet';
import DiceRoller from '../components/dice/DiceRoller';
import Chat from '../components/chat/Chat';
import GameMap from '../components/map/GameMap';
import RulesBook from '../components/rules/RulesBook';
import SessionLog from '../components/session/SessionLog';
import SpellsBook from '../components/Spells/SpellsBook';
import PotionsBook from '../components/Potions/PotionsBook';
import { useChat } from '../hooks/useChat';
import { getRoom, removeRoom } from '../services/roomService';
import { Character } from '../types/character';
import { useMultiplayer } from '../hooks/useMultiplayer';

const Master = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSessionLog, setShowSessionLog] = useState(false);
  const [showSpells, setShowSpells] = useState(false);
  const [showPotions, setShowPotions] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [masterName, setMasterName] = useState('');

  const { messages, sendMessage, sendRollMessage } = useChat(code || '', masterName || 'Мастер');
  const multiplayer = useMultiplayer(code || '', masterName || 'Мастер', 'master');

  useEffect(() => {
    if (code) {
      const currentRoom = getRoom(code);
      setRoom(currentRoom);
      if (!currentRoom) navigate('/');
      else {
        const master = currentRoom.players.find((p: any) => p.role === 'master');
        if (master) setMasterName(master.name);
      }
    } else navigate('/');
  }, [code, navigate]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-ivory">
        <div className="text-center">
          <p className="text-2xl font-serif text-dark-chocolate mb-4">Комната не найдена</p>
          <Button variant="primary" onClick={() => navigate('/')}>Вернуться на главную</Button>
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

  const handleRoll = (text: string) => sendRollMessage(text);

  return (
    <div className="flex flex-col h-screen bg-soft-ivory">
      <header className="flex justify-between items-center px-6 py-3 border-b border-caramel/20 bg-soft-ivory/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <span className="font-serif text-xl text-dark-chocolate">КПМБ</span>
          <span className="text-xs text-walnut/50 bg-caramel/10 px-2 py-0.5 rounded-full">Мастер</span>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-walnut/60">Код:</span>
            <span className="font-mono font-bold text-lg text-caramel bg-caramel/10 px-3 py-1 rounded-lg">{room.code}</span>
            <button onClick={handleCopyCode} className="p-1 hover:bg-caramel/10 rounded-lg transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-walnut/60" />}
            </button>
          </div>
          {room.password && (
            <div className="flex items-center space-x-1 text-xs">
              <Key className="w-3 h-3 text-amber-500" />
              <button onClick={() => setShowPassword(!showPassword)} className="text-walnut/40 hover:text-amber-500 transition-colors">
                {showPassword ? room.password : '••••••'}
              </button>
            </div>
          )}
          <span className="text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
            👥 {multiplayer.playerCount} игроков
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-walnut/60">
            <Users className="w-4 h-4" />
            <span>{room.players.length} в комнате</span>
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
          <button onClick={() => setShowRules(true)} className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Правила">
            <BookOpen className="w-6 h-6" />
          </button>
          <button onClick={() => setShowSpells(true)} className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Заклинания">
            <Sparkles className="w-6 h-6" />
          </button>
          <button onClick={() => setShowPotions(true)} className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Зелья">
            <FlaskConical className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Настройки">
            <Settings className="w-6 h-6" />
          </button>
          <button onClick={() => setShowSessionLog(true)} className="p-2 rounded-lg text-walnut/60 hover:text-caramel hover:bg-caramel/10 transition-colors" title="Сводка">
            <FileText className="w-6 h-6" />
          </button>
          <div className="flex-1"></div>
          <button onClick={() => setShowDiceRoller(true)} className="p-2 rounded-lg bg-caramel text-soft-ivory hover:bg-walnut transition-colors shadow-lg" title="Бросок">
            <Dice5 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 relative bg-walnut/5 rounded-xl border border-caramel/20 shadow-inner overflow-hidden">
          <GameMap roomCode={room.code} isMaster={true} />
        </div>

        <div className="w-80 flex flex-col">
          <Chat 
            messages={messages} 
            onSendMessage={sendMessage} 
            currentUserName={masterName || 'Мастер'} 
            className="flex-1" 
            maxHeight="calc(100vh - 200px)" 
          />
        </div>
      </div>

      {showCharacterSheet && selectedCharacter && (
        <CharacterSheet 
          character={selectedCharacter} 
          onClose={() => { setShowCharacterSheet(false); setSelectedCharacter(null); }} 
          readOnly={true} 
        />
      )}

      {showDiceRoller && (
        <DiceRoller 
          onRoll={handleRoll} 
          onClose={() => setShowDiceRoller(false)} 
          userId={`master_${room.code}`} 
          userName={masterName || 'Мастер'} 
        />
      )}

      {showRules && <RulesBook onClose={() => setShowRules(false)} />}
      {showSpells && <SpellsBook onClose={() => setShowSpells(false)} />}
      {showPotions && <PotionsBook onClose={() => setShowPotions(false)} />}
      {showSessionLog && <SessionLog roomCode={room.code} onClose={() => setShowSessionLog(false)} />}
    </div>
  );
};

export default Master;
