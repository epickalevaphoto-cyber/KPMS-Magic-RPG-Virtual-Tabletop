import { useState } from 'react';
import { Dice5, Plus, Minus, X, History, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { rollD10, rollD100, rollCheck, addToHistory, formatRollText, getRollHistory, clearRollHistory } from '../../services/diceService';

interface DiceRollerProps {
  onRoll?: (text: string) => void;
  onClose: () => void;
  userId?: string;
  userName?: string;
}

const DiceRoller = ({ onRoll, onClose, userId = 'system', userName = 'Игрок' }: DiceRollerProps) => {
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [diceType, setDiceType] = useState<'d10' | 'd100'>('d10');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(getRollHistory());
  
  // Для проверки (по правилам Гарри Поттер)
  const [characteristic, setCharacteristic] = useState(3);
  const [skill, setSkill] = useState(2);
  const [difficulty, setDifficulty] = useState(12);
  const [showCheckMode, setShowCheckMode] = useState(false);

  const handleRoll = () => {
    let roll;
    
    if (showCheckMode) {
      roll = rollCheck(characteristic, skill, 0, difficulty);
    } else if (diceType === 'd100') {
      roll = rollD100(modifier);
    } else {
      roll = rollD10(diceCount, modifier);
    }
    
    roll.userId = userId;
    roll.userName = userName;
    
    addToHistory(roll);
    setHistory(getRollHistory());
    
    const text = formatRollText(roll);
    if (onRoll) {
      onRoll(text);
    }
    
    // Закрываем после броска для чистоты UI
    // onClose();
  };

  const handleClearHistory = () => {
    if (window.confirm('Очистить историю бросков?')) {
      clearRollHistory();
      setHistory([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-soft-ivory rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-2xl font-semibold text-dark-chocolate flex items-center">
            <Dice5 className="w-6 h-6 text-caramel mr-2" />
            Бросок кубика
          </h3>
          <button onClick={onClose} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Переключение режимов */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setShowCheckMode(false)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !showCheckMode 
                ? 'bg-caramel text-soft-ivory' 
                : 'bg-vanilla-cream text-walnut hover:bg-caramel/10'
            }`}
          >
            Простой бросок
          </button>
          <button
            onClick={() => setShowCheckMode(true)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showCheckMode 
                ? 'bg-caramel text-soft-ivory' 
                : 'bg-vanilla-cream text-walnut hover:bg-caramel/10'
            }`}
          >
            Проверка (1d10 + хар-ка + навык)
          </button>
        </div>

        {!showCheckMode ? (
          /* Простой бросок */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Тип кубика</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setDiceType('d10')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    diceType === 'd10'
                      ? 'bg-caramel text-soft-ivory'
                      : 'bg-vanilla-cream text-walnut hover:bg-caramel/10'
                  }`}
                >
                  d10
                </button>
                <button
                  onClick={() => setDiceType('d100')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    diceType === 'd100'
                      ? 'bg-caramel text-soft-ivory'
                      : 'bg-vanilla-cream text-walnut hover:bg-caramel/10'
                  }`}
                >
                  d100
                </button>
              </div>
            </div>

            {diceType === 'd10' && (
              <div>
                <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Количество кубиков</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                    className="p-2 rounded-lg bg-vanilla-cream hover:bg-caramel/10 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-walnut" />
                  </button>
                  <span className="w-12 text-center text-xl font-bold text-dark-chocolate">{diceCount}</span>
                  <button
                    onClick={() => setDiceCount(Math.min(10, diceCount + 1))}
                    className="p-2 rounded-lg bg-vanilla-cream hover:bg-caramel/10 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-walnut" />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Модификатор</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setModifier(modifier - 1)}
                  className="p-2 rounded-lg bg-vanilla-cream hover:bg-caramel/10 transition-colors"
                >
                  <Minus className="w-4 h-4 text-walnut" />
                </button>
                <span className="w-12 text-center text-xl font-bold text-dark-chocolate">{modifier}</span>
                <button
                  onClick={() => setModifier(modifier + 1)}
                  className="p-2 rounded-lg bg-vanilla-cream hover:bg-caramel/10 transition-colors"
                >
                  <Plus className="w-4 h-4 text-walnut" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Проверка (по правилам Гарри Поттер) */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Характеристика (1-10)</label>
              <input
                type="number"
                value={characteristic}
                onChange={(e) => setCharacteristic(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
                min={1}
                max={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Навык (0-10)</label>
              <input
                type="number"
                value={skill}
                onChange={(e) => setSkill(Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
                min={0}
                max={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Сложность (3-25)</label>
              <input
                type="number"
                value={difficulty}
                onChange={(e) => setDifficulty(Math.min(25, Math.max(3, parseInt(e.target.value) || 12)))}
                className="w-full px-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
                min={3}
                max={25}
              />
            </div>
            <div className="text-xs text-walnut/60 bg-vanilla-cream/50 p-2 rounded-lg">
              <p>📖 Формула: 1d10 + Характеристика + Навык</p>
              <p>Целевое значение: {difficulty}</p>
            </div>
          </div>
        )}

        <Button variant="primary" size="lg" className="w-full mt-6" onClick={handleRoll}>
          <Dice5 className="w-5 h-5 mr-2" />
          Бросить!
        </Button>

        {/* История бросков */}
        <div className="mt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 text-sm text-walnut/60 hover:text-caramel transition-colors"
          >
            <History className="w-4 h-4" />
            <span>История бросков ({history.length})</span>
          </button>
          
          {showHistory && (
            <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
              {history.length === 0 ? (
                <p className="text-xs text-walnut/40">Нет бросков</p>
              ) : (
                <>
                  <div className="flex justify-end mb-1">
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Очистить
                    </button>
                  </div>
                  {history.slice(0, 20).map((roll) => (
                    <div key={roll.id} className="text-xs text-walnut/60 bg-vanilla-cream/30 rounded px-2 py-1">
                      <span className="text-dark-chocolate font-medium">{roll.userName}</span>
                      : {roll.results.join(' + ')}
                      {roll.modifier !== 0 && ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}`}
                      = <span className="font-bold text-caramel">{roll.total}</span>
                      {'degree' in roll && (
                        <span className="ml-1">
                          {(roll as any).degree === 'critical' && '🎉'}
                          {(roll as any).degree === 'fumble' && '💀'}
                          {(roll as any).success && '✅'}
                          {!(roll as any).success && (roll as any).degree !== 'fumble' && '❌'}
                        </span>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;
