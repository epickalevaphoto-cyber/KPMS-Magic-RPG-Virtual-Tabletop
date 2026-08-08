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

  const characters = getCharactersByRoom(room.id);
  const myCharacter = getCharacterByUser(userId, room.id);

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
    <div className="flex flex-col h-screen bg-soft-ivory">
      <header className="flex justify-between items-center px-6 py-3 border-b border-caramel/20 bg-soft-ivory/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-xl text-dark-chocolate">КПМБ</span>
          <span className="text-xs text-walnut/50 bg-caramel/10 px-2 py-0.5 rounded-full">Игрок</span>
          <span className="text-xs text-walnut/40 bg-vanilla-cream/50 px-2 py-0.5 rounded-full">
            {room.name}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCharacterList(!showCharacterList)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-caramel/10 hover:bg-caramel/20 transition-colors"
          >
            <User className="w-4 h-4 text-caramel" />
            <span className="text-sm text-dark-chocolate/80">
              {myCharacter ? myCharacter.name : 'Нет персонажа'}
            </span>
          </button>
          <div className="flex items-center space-x-2 text-sm text-walnut/60">
            <Users className="w-4 h-4" />
            <span>{room.players.length} игроков</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-walnut/60 hover:text-dark-chocolate">
            <LogOut className="w-4 h-4 mr-1" /> Выйти
          </Button>
        </div>
      </header>

      <main className="flex-1 relative bg-walnut/5 m-2 rounded-xl border border-caramel/20 shadow-inner overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-walnut/30">
          <div className="text-center">
            <p className="text-6xl mb-4">🗺️</p>
            <p className="font-serif text-2xl text-dark-chocolate">{room.name}</p>
            <p className="text-sm text-walnut">Игровая карта</p>
            <p className="text-xs mt-2 text-walnut/30">Код комнаты: {room.code}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-soft-ivory/80 backdrop-blur-sm rounded-lg shadow-lg border border-caramel/20 p-3 flex flex-col">
          <p className="text-xs font-semibold text-dark-chocolate/70 border-b border-caramel/20 pb-1 mb-2">Чат</p>
          <div className="flex-1 overflow-y-auto text-xs space-y-1 text-walnut/60">
            <p>Добро пожаловать в игру!</p>
            <p>Мастер: Вы просыпаетесь в Большом зале...</p>
          </div>
          <input type="text" placeholder="Написать..." className="mt-2 w-full text-xs rounded border border-caramel/30 bg-transparent px-2 py-1 focus:outline-none focus:border-caramel" />
        </div>
      </main>

      <footer className="bg-soft-ivory/80 backdrop-blur-sm border-t border-caramel/20 p-2 flex justify-around items-center">
        <button
          onClick={() => {
            if (myCharacter) {
              setSelectedCharacter(myCharacter);
              setShowCharacterSheet(true);
            }
          }}
          className="flex flex-col items-center text-walnut/60 hover:text-caramel transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Персонаж</span>
        </button>
        <button className="flex flex-col items-center text-walnut/60 hover:text-caramel transition-colors">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Правила</span>
        </button>
        <button className="flex flex-col items-center text-walnut/60 hover:text-caramel transition-colors">
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Заклинания</span>
        </button>
        <button className="flex flex-col items-center text-walnut/60 hover:text-caramel transition-colors">
          <FlaskConical className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Зелья</span>
        </button>
        <button className="flex flex-col items-center text-caramel relative">
          <div className="w-12 h-12 -mt-4 bg-caramel rounded-full flex items-center justify-center shadow-lg hover:bg-walnut transition-colors">
            <Dice5 className="w-6 h-6 text-soft-ivory" />
          </div>
          <span className="text-[10px] font-medium mt-0.5 text-dark-chocolate">Бросок</span>
        </button>
        <button className="flex flex-col items-center text-walnut/60 hover:text-caramel transition-colors">
          <Backpack className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Инвентарь</span>
        </button>
        <button className="flex flex-col items-center text-walnut/60 hover:text-caramel transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Настройки</span>
        </button>
      </footer>

      {showCharacterList && (
        <div className="absolute right-4 top-16 bg-soft-ivory rounded-xl shadow-xl border border-caramel/20 p-4 min-w-64 z-10">
          <h4 className="font-serif text-sm font-semibold text-dark-chocolate mb-3">Мои персонажи</h4>
          {characters.length === 0 ? (
            <p className="text-xs text-walnut/40">Нет персонажей</p>
          ) : (
            <div className="space-y-2">
              {characters.map(char => (
                <button
                  key={char.id}
                  onClick={() => handleSelectCharacter(char)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    myCharacter?.id === char.id ? 'bg-caramel/10 border border-caramel/30' : 'hover:bg-vanilla-cream/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-dark-chocolate">{char.name}</span>
                    <span className="text-xs text-walnut/40">{char.house || 'Без факультета'}</span>
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
