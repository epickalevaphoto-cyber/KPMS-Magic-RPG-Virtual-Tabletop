import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LogOut, BookOpen, Sparkles, FlaskConical, Dice5, 
  Backpack, Settings, Users, User, Plus 
} from 'lucide-react';
import Button from '../components/ui/Button';
import CharacterSheet from '../components/character/CharacterSheet';
import { getRoom } from '../services/roomService';
import { 
  getCharacterByUser, 
  createCharacter, 
  getCharactersByRoom 
} from '../services/characterService';
import { Character } from '../types/character';

function getPlayerId(): string {
  let id = sessionStorage.getItem('kpms_player_id');
  if (!id) {
    id = `player_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    sessionStorage.setItem('kpms_player_id', id);
  }
  return id;
}

const Player = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showCharacterList, setShowCharacterList] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const userId = getPlayerId();

  useEffect(() => {
    console.log('🔍 Player component mounted with code:', code);
    if (code) {
      const currentRoom = getRoom(code);
      console.log('🔍 Retrieved room:', currentRoom);
      setRoom(currentRoom);
      
      if (!currentRoom) {
        console.log('❌ Room not found, navigating to home');
        navigate('/');
      }
    } else {
      console.log('❌ No code provided, navigating to home');
      navigate('/');
    }
  }, [code, navigate]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-krem">
        <div className="text-center">
          <p className="text-2xl font-serif mb-4">Комната не найдена</p>
          <p className="text-sm text-brown-dark/40 mb-4">Код: {code || 'не указан'}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  const characters = getCharactersByRoom(room.id);
  const myCharacter = getCharacterByUser(userId, room.id);

  console.log('✅ Room loaded:', { room: room.code, players: room.players.length });

  const handleCreateCharacter = () => {
    const newChar = createCharacter(userId, room.id, `Игрок ${characters.length + 1}`);
    setSelectedCharacter(newChar);
    setShowCharacterSheet(true);
  };

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    setShowCharacterSheet(true);
    setShowCharacterList(false);
  };

  return (
    <div className="flex flex-col h-screen bg-krem">
      <header className="flex justify-between items-center px-6 py-3 border-b border-gold/20 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-xl text-ink">KPMS</span>
          <span className="text-xs text-brown-dark/50 bg-gold/10 px-2 py-0.5 rounded-full">Игрок</span>
          <span className="text-xs text-brown-dark/40 bg-krem/50 px-2 py-0.5 rounded-full">
            {room.name}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCharacterList(!showCharacterList)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 transition-colors"
          >
            <User className="w-4 h-4 text-gold" />
            <span className="text-sm text-brown-dark/80">
              {myCharacter ? myCharacter.name : 'Нет персонажа'}
            </span>
          </button>
          <div className="flex items-center space-x-2 text-sm text-brown-dark/60">
            <Users className="w-4 h-4" />
            <span>{room.players.length} игроков</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-brown-dark/60 hover:text-ink">
            <LogOut className="w-4 h-4 mr-1" /> Выйти
          </Button>
        </div>
      </header>

      <main className="flex-1 relative bg-brown-dark/5 m-2 rounded-xl border border-gold/20 shadow-inner overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-brown-dark/30">
          <div className="text-center">
            <p className="text-6xl mb-4">🗺️</p>
            <p className="font-serif text-2xl">{room.name}</p>
            <p className="text-sm">Игровая карта</p>
            <p className="text-xs mt-2 text-brown-dark/20">Код комнаты: {room.code}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-white/60 backdrop-blur-sm rounded-lg shadow-lg border border-gold/20 p-3 flex flex-col">
          <p className="text-xs font-semibold text-brown-dark/70 border-b border-gold/20 pb-1 mb-2">Чат</p>
          <div className="flex-1 overflow-y-auto text-xs space-y-1 text-brown-dark/60">
            <p>Добро пожаловать в игру!</p>
            <p>Мастер: Вы просыпаетесь в Большом зале...</p>
          </div>
          <input type="text" placeholder="Написать..." className="mt-2 w-full text-xs rounded border border-gold/30 bg-transparent px-2 py-1 focus:outline-none focus:border-gold" />
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-gold/20 p-2 flex justify-around items-center">
        <button
          onClick={() => {
            if (myCharacter) {
              setSelectedCharacter(myCharacter);
              setShowCharacterSheet(true);
            }
          }}
          className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Персонаж</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Правила</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Заклинания</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <FlaskConical className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Зелья</span>
        </button>
        <button className="flex flex-col items-center text-gold relative">
          <div className="w-12 h-12 -mt-4 bg-gold rounded-full flex items-center justify-center shadow-lg hover:bg-gold-dark transition-colors">
            <Dice5 className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-medium mt-0.5 text-ink">Бросок</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <Backpack className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Инвентарь</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Настройки</span>
        </button>
      </footer>

      {showCharacterList && (
        <div className="absolute right-4 top-16 bg-white rounded-xl shadow-xl border border-gold/20 p-4 min-w-64 z-10">
          <h4 className="font-serif text-sm font-semibold mb-3">Мои персонажи</h4>
          {characters.length === 0 ? (
            <p className="text-xs text-brown-dark/40">Нет персонажей</p>
          ) : (
            <div className="space-y-2">
              {characters.map(char => (
                <button
                  key={char.id}
                  onClick={() => handleSelectCharacter(char)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    myCharacter?.id === char.id ? 'bg-gold/10 border border-gold/30' : 'hover:bg-krem/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{char.name}</span>
                    <span className="text-xs text-brown-dark/40">{char.house || 'Без факультета'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          <Button
            variant="primary"
            size="sm"
            className="w-full mt-3"
            onClick={handleCreateCharacter}
          >
            <Plus className="w-4 h-4 mr-1" /> Создать персонажа
          </Button>
        </div>
      )}

      {showCharacterSheet && selectedCharacter && (
        <CharacterSheet
          character={selectedCharacter}
          onClose={() => {
            setShowCharacterSheet(false);
            setShowCharacterList(false);
          }}
          readOnly={false}
        />
      )}
    </div>
  );
};

export default Player;
