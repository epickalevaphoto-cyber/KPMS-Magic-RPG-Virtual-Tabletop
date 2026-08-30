import { useState, useEffect } from 'react';
import { Search, X, Wand2, BookOpen, Dice5 } from 'lucide-react';
import { loadGameData, Spell } from '../../services/dataService';
import DiceRoller from '../dice/DiceRoller';

interface SpellsBookProps {
  onClose: () => void;
  userId?: string;
  userName?: string;
  character?: {
    vitality: number;
    speed: number;
    intelligence: number;
    knowledge: number;
    focus: number;
    skills?: { [key: string]: number };
  };
  onRoll?: (text: string) => void;
}

const SpellsBook = ({ 
  onClose, 
  userId = 'system', 
  userName = 'Игрок',
  character,
  onRoll
}: SpellsBookProps) => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadGameData();
      setSpells(data.spells || []);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredSpells = spells.filter(spell => {
    const matchesSearch = spell.name.toLowerCase().includes(search.toLowerCase()) ||
                          spell.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || spell.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ['all', ...new Set(spells.map(s => s.type))];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Чары': 'bg-blue-500/10 text-blue-600',
      'Проклятие': 'bg-red-500/10 text-red-600',
      'Сглаз': 'bg-purple-500/10 text-purple-600',
      'Трансфигурация': 'bg-green-500/10 text-green-600',
      'Контрсглаз': 'bg-yellow-500/10 text-yellow-600',
      'Телепортация': 'bg-indigo-500/10 text-indigo-600'
    };
    return colors[type] || 'bg-gray-500/10 text-gray-600';
  };

  const handleCastSpell = (spell: Spell) => {
    setSelectedSpell(spell);
    setShowDiceRoller(true);
  };

  const handleRollFromSpell = (text: string) => {
    if (onRoll) onRoll(text);
    setShowDiceRoller(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-soft-ivory rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b border-caramel/20">
            <h2 className="font-serif text-2xl font-semibold text-dark-chocolate flex items-center">
              <Wand2 className="w-6 h-6 text-caramel mr-2" /> Заклинания
              <span className="ml-2 text-sm font-normal text-walnut/40">{spells.length}</span>
            </h2>
            <button onClick={onClose} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-3 border-b border-caramel/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-walnut/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск заклинаний..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-white"
              />
            </div>
          </div>

          <div className="px-6 py-2 border-b border-caramel/10 flex flex-wrap gap-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-caramel text-soft-ivory'
                    : 'bg-vanilla-cream text-walnut/70 hover:bg-caramel/10'
                }`}
              >
                {type === 'all' ? 'Все' : type}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-caramel"></div>
              </div>
            ) : filteredSpells.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-walnut/30">
                <BookOpen className="w-16 h-16 mb-4" />
                <p className="font-serif text-lg">Заклинаний не найдено</p>
              </div>
            ) : (
              filteredSpells.map((spell, index) => (
                <div key={index} className="bg-white/60 rounded-xl p-4 border border-caramel/10 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-serif text-lg font-semibold text-dark-chocolate">{spell.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(spell.type)}`}>
                          {spell.type}
                        </span>
                        <span className="text-xs text-walnut/40">Сложность: {spell.difficulty}</span>
                      </div>
                      <p className="text-sm text-walnut/70 mt-1">{spell.description}</p>
                    </div>
                    <button
                      onClick={() => handleCastSpell(spell)}
                      className="ml-4 px-3 py-1.5 rounded-lg bg-caramel text-soft-ivory hover:bg-walnut transition-colors text-xs flex items-center space-x-1 flex-shrink-0"
                    >
                      <Dice5 className="w-3 h-3" />
                      <span>Бросить</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-6 py-3 border-t border-caramel/20 text-xs text-walnut/40 text-center">
            {filteredSpells.length} из {spells.length} заклинаний
          </div>
        </div>
      </div>

      {/* DiceRoller для заклинания */}
      {showDiceRoller && selectedSpell && (
        <DiceRoller
          onRoll={handleRollFromSpell}
          onClose={() => setShowDiceRoller(false)}
          userId={userId}
          userName={userName}
          character={character}
          presetModifier={selectedSpell.difficulty}
          presetLabel={`Сложность заклинания "${selectedSpell.name}"`}
        />
      )}
    </>
  );
};

export default SpellsBook;
