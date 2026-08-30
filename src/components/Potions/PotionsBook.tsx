import { useState, useEffect } from 'react';
import { Search, X, FlaskConical, BookOpen, Check } from 'lucide-react';
import { loadGameData, Potion } from '../../services/dataService';
import Button from '../ui/Button';
import DiceRoller from '../dice/DiceRoller';

interface PotionsBookProps {
  onClose: () => void;
  userId?: string;
  userName?: string;
  character?: {
    knowledge: number;
    skills?: { [key: string]: number };
  };
  onRoll?: (text: string) => void;
  onAddToInventory?: (potionName: string) => void;
  inventory?: string[];
  onUsePotion?: (potionName: string, effect: string) => void;
}

const PotionsBook = ({ 
  onClose, 
  userId = 'system', 
  userName = 'Игрок',
  character,
  onRoll,
  onAddToInventory,
  inventory = [],
  onUsePotion
}: PotionsBookProps) => {
  const [potions, setPotions] = useState<Potion[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null);
  const [showBrewResult, setShowBrewResult] = useState(false);
  const [brewResult, setBrewResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [brewingPotion, setBrewingPotion] = useState<Potion | null>(null);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadGameData();
      setPotions(data.potions || []);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredPotions = potions.filter(potion =>
    potion.name.toLowerCase().includes(search.toLowerCase()) ||
    potion.description.toLowerCase().includes(search.toLowerCase()) ||
    potion.effect.toLowerCase().includes(search.toLowerCase())
  );

  const isPotionInInventory = (potionName: string): boolean => {
    return inventory.includes(potionName);
  };

  const brewPotion = (potion: Potion) => {
    setBrewingPotion(potion);
    setShowDiceRoller(true);
  };

  const handleBrewRoll = (text: string) => {
    const totalMatch = text.match(/\*\*(\d+)\*\*$/);
    const total = totalMatch ? parseInt(totalMatch[1]) : 0;
    const difficulty = 15;
    const success = total >= difficulty;
    
    setBrewResult({
      success: success,
      message: success 
        ? `✅ Вы успешно сварили зелье "${brewingPotion?.name}"!`
        : `❌ Варка зелья "${brewingPotion?.name}" провалилась. Попробуйте снова.`
    });
    setShowBrewResult(true);
    setShowDiceRoller(false);
    
    if (onRoll) onRoll(text);
  };

  const addToInventory = (potionName: string) => {
    if (onAddToInventory) {
      onAddToInventory(potionName);
    }
    setShowBrewResult(false);
    setBrewingPotion(null);
  };

  const usePotion = (potion: Potion) => {
    setSelectedPotion(potion);
    setShowEffect(true);
    if (onUsePotion) {
      onUsePotion(potion.name, potion.effect);
    }
    if (onRoll) {
      onRoll(`🧪 **${userName}** использовал зелье **${potion.name}**: ${potion.effect}`);
    }
  };

  const getPotionSkill = (): number => {
    return character?.skills?.['Зельеварение'] || 0;
  };

  return (
    <>
      <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-soft-ivory rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b border-caramel/20">
            <h2 className="font-serif text-2xl font-semibold text-dark-chocolate flex items-center">
              <FlaskConical className="w-6 h-6 text-caramel mr-2" /> Зелья
              <span className="ml-2 text-sm font-normal text-walnut/40">{potions.length}</span>
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
                placeholder="Поиск зелий..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-caramel"></div>
              </div>
            ) : filteredPotions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-walnut/30">
                <BookOpen className="w-16 h-16 mb-4" />
                <p className="font-serif text-lg">Зелий не найдено</p>
              </div>
            ) : (
              filteredPotions.map((potion, index) => {
                const hasPotion = isPotionInInventory(potion.name);
                return (
                  <div key={index} className="bg-white/60 rounded-xl p-4 border border-caramel/10 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-serif text-lg font-semibold text-dark-chocolate">{potion.name}</h3>
                          {hasPotion && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                              ✅ В инвентаре
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-walnut/70 mt-1">{potion.description}</p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="bg-vanilla-cream/50 rounded-lg px-3 py-1.5">
                            <span className="text-walnut/40">Ингредиенты:</span>
                            <span className="ml-1 text-dark-chocolate/80">{potion.ingredients}</span>
                          </div>
                          <div className="bg-vanilla-cream/50 rounded-lg px-3 py-1.5">
                            <span className="text-walnut/40">Эффект:</span>
                            <span className="ml-1 text-dark-chocolate/80">{potion.effect}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1 ml-4 flex-shrink-0">
                        {!hasPotion ? (
                          <button
                            onClick={() => brewPotion(potion)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors text-xs flex items-center space-x-1"
                          >
                            <FlaskConical className="w-3 h-3" />
                            <span>Сварить</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => usePotion(potion)}
                            className="px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-xs flex items-center space-x-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Использовать</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-6 py-3 border-t border-caramel/20 text-xs text-walnut/40 text-center">
            {filteredPotions.length} из {potions.length} зелий
          </div>
        </div>
      </div>

      {/* DiceRoller для варки зелья */}
      {showDiceRoller && brewingPotion && (
        <DiceRoller
          onRoll={handleBrewRoll}
          onClose={() => setShowDiceRoller(false)}
          userId={userId}
          userName={userName}
          character={character ? {
            vitality: 0,
            speed: 0,
            intelligence: character.knowledge || 3,
            knowledge: character.knowledge || 3,
            focus: 0,
            skills: character.skills || {}
          } : undefined}
          presetModifier={(character?.knowledge || 3) + getPotionSkill()}
          presetLabel={`Варка зелья "${brewingPotion.name}" (1d10 + Знания + Зельеварение)`}
        />
      )}

      {/* Модальное окно результата варки */}
      {showBrewResult && brewResult && brewingPotion && (
        <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-soft-ivory rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl font-semibold text-dark-chocolate flex items-center">
                <FlaskConical className="w-5 h-5 text-caramel mr-2" />
                Варка зелья
              </h3>
              <button onClick={() => { setShowBrewResult(false); setBrewingPotion(null); }} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`rounded-lg p-4 mb-4 ${brewResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm font-medium ${brewResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {brewResult.message}
              </p>
              {brewResult.success && (
                <p className="text-xs text-green-700 mt-2">
                  Зелье добавлено в инвентарь!
                </p>
              )}
            </div>
            <div className="bg-vanilla-cream/50 rounded-lg p-3 text-xs text-walnut/60">
              <p><span className="font-medium">Название:</span> {brewingPotion.name}</p>
              <p className="mt-1"><span className="font-medium">Эффект:</span> {brewingPotion.effect}</p>
            </div>
            {brewResult.success ? (
              <Button variant="primary" className="w-full mt-4" onClick={() => addToInventory(brewingPotion.name)}>
                <Check className="w-4 h-4 mr-2" /> Положить в инвентарь
              </Button>
            ) : (
              <div className="flex space-x-3 mt-4">
                <Button variant="secondary" className="flex-1" onClick={() => { setShowBrewResult(false); setBrewingPotion(null); }}>
                  Закрыть
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => { setShowBrewResult(false); brewPotion(brewingPotion); }}>
                  Попробовать снова
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно использования зелья */}
      {showEffect && selectedPotion && (
        <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-soft-ivory rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl font-semibold text-dark-chocolate flex items-center">
                <FlaskConical className="w-5 h-5 text-caramel mr-2" />
                Использование зелья
              </h3>
              <button onClick={() => setShowEffect(false)} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800 font-medium">✅ {selectedPotion.name} использовано!</p>
              <p className="text-sm text-green-700 mt-1">{selectedPotion.effect}</p>
            </div>
            <div className="bg-vanilla-cream/50 rounded-lg p-3 text-xs text-walnut/60">
              <p><span className="font-medium">Описание:</span> {selectedPotion.description}</p>
            </div>
            <Button variant="primary" className="w-full mt-4" onClick={() => setShowEffect(false)}>
              Понятно
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PotionsBook;
