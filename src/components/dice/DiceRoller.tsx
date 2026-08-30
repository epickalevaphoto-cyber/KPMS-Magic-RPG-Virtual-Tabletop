import { useState, useEffect } from 'react';
import { Dice5, Plus, Minus, X, History, Trash2, Zap, Heart, Wind, Brain, BookOpen, Target } from 'lucide-react';
import Button from '../ui/Button';
import { rollD10, rollD100, rollCheck, addToHistory, formatRollText, getRollHistory, clearRollHistory, rollDice } from '../../services/diceService';
import { loadGameData } from '../../services/dataService';

interface DiceRollerProps {
  onRoll?: (text: string) => void;
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
}

function rollD6(count: number = 1, modifier: number = 0) {
  const results = rollDice(count, 6);
  const total = results.reduce((sum, r) => sum + r, 0) + modifier;
  return {
    id: `roll_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: 'system',
    userName: 'Система',
    diceType: 'd6' as const,
    diceCount: count,
    modifier: modifier,
    results: results,
    total: total,
    timestamp: Date.now()
  };
}

const DiceRoller = ({ 
  onRoll, 
  onClose, 
  userId = 'system', 
  userName = 'Игрок',
  character 
}: DiceRollerProps) => {
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [diceType, setDiceType] = useState<'d6' | 'd10' | 'd100'>('d10');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(getRollHistory());
  const [characteristic, setCharacteristic] = useState(3);
  const [skill, setSkill] = useState(2);
  const [difficulty, setDifficulty] = useState(12);
  const [showCheckMode, setShowCheckMode] = useState(false);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  // Загружаем список навыков
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await loadGameData();
        // Извлекаем уникальные навыки из заклинаний (или используем стандартный список)
        const skills = ['Чары', 'Зельеварение', 'Трансфигурация', 'Защита от тёмных искусств', 'Травология', 'Полёт на метле', 'Дуэль', 'Алхимия', 'Артефакторика', 'История магии', 'Магловедение', 'Прорицание', 'Нумерология', 'Изучение древних рун'];
        setSkillsList(skills);
        if (skills.length > 0) setSelectedSkill(skills[0]);
      } catch (error) {
        console.error('Error loading skills:', error);
        const defaultSkills = ['Чары', 'Зельеварение', 'Трансфигурация', 'Защита от тёмных искусств', 'Травология'];
        setSkillsList(defaultSkills);
        setSelectedSkill(defaultSkills[0]);
      }
    };
    loadSkills();
  }, []);

  // Быстрый бросок с характеристикой
  const quickRollCharacteristic = (name: string, value: number) => {
    const roll = rollD10(1, value);
    roll.userId = userId;
    roll.userName = userName;
    addToHistory(roll);
    setHistory(getRollHistory());
    const text = `🎲 **${userName}** бросил **${name}** (1d10 + ${value}): **${roll.results.join(' + ')}** + ${value} = **${roll.total}**`;
    if (onRoll) onRoll(text);
  };

  // Быстрый бросок с навыком
  const quickRollSkill = (name: string, value: number) => {
    // Для навыка используем характеристику, указанную в чарлисте
    // Если нет - используем Сообразительность по умолчанию
    const charValue = character?.intelligence || 3;
    const totalModifier = charValue + value;
    const roll = rollD10(1, totalModifier);
    roll.userId = userId;
    roll.userName = userName;
    addToHistory(roll);
    setHistory(getRollHistory());
    const text = `🎲 **${userName}** бросил **${name}** (1d10 + ${charValue} + ${value}): **${roll.results.join(' + ')}** + ${charValue} + ${value} = **${roll.total}**`;
    if (onRoll) onRoll(text);
  };

  // Бросок с выбором характеристики и навыка
  const rollWithCharAndSkill = (charName: string, charValue: number, skillName: string, skillValue: number) => {
    const totalModifier = charValue + skillValue;
    const roll = rollD10(1, totalModifier);
    roll.userId = userId;
    roll.userName = userName;
    addToHistory(roll);
    setHistory(getRollHistory());
    const text = `🎲 **${userName}** бросил **${skillName}** (1d10 + ${charName}(${charValue}) + ${skillName}(${skillValue})): **${roll.results.join(' + ')}** + ${charValue} + ${skillValue} = **${roll.total}**`;
    if (onRoll) onRoll(text);
  };

  const handleRoll = () => {
    let roll;
    if (showCheckMode) {
      roll = rollCheck(characteristic, skill, 0, difficulty);
    } else if (diceType === 'd100') {
      roll = rollD100(modifier);
    } else if (diceType === 'd6') {
      roll = rollD6(diceCount, modifier);
    } else {
      roll = rollD10(diceCount, modifier);
    }
    roll.userId = userId;
    roll.userName = userName;
    addToHistory(roll);
    setHistory(getRollHistory());
    const text = formatRollText(roll);
    if (onRoll) onRoll(text);
  };

  const handleClearHistory = () => {
    if (window.confirm('Очистить историю бросков?')) {
      clearRollHistory();
      setHistory([]);
    }
  };

  const getDiceDescription = (type: string) => {
    switch (type) {
      case 'd6': return 'Классический шестигранный кубик';
      case 'd10': return 'Основной кубик для системы Гарри Поттер';
      case 'd100': return 'Процентный бросок (0-99)';
      default: return '';
    }
  };

  // Получаем значения характеристик из персонажа
  const charStats = character || { vitality: 3, speed: 3, intelligence: 3, knowledge: 3, focus: 3 };

  return (
    <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-soft-ivory rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-2xl font-semibold text-dark-chocolate flex items-center">
            <Dice5 className="w-6 h-6 text-caramel mr-2" /> Бросок кубика
          </h3>
          <button onClick={onClose} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Быстрые броски */}
        <div className="mb-4">
          <p className="text-xs font-medium text-walnut/60 mb-2">⚡ Быстрые броски</p>
          <div className="grid grid-cols-3 gap-1.5">
            <button 
              onClick={() => quickRollCharacteristic('Живучесть', charStats.vitality)}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-xs"
            >
              <Heart className="w-3 h-3 text-red-500" />
              <span className="text-dark-chocolate">Жив</span>
              <span className="text-walnut/40">+{charStats.vitality}</span>
            </button>
            <button 
              onClick={() => quickRollCharacteristic('Скорость', charStats.speed)}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-xs"
            >
              <Wind className="w-3 h-3 text-blue-500" />
              <span className="text-dark-chocolate">Ск</span>
              <span className="text-walnut/40">+{charStats.speed}</span>
            </button>
            <button 
              onClick={() => quickRollCharacteristic('Сообразительность', charStats.intelligence)}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-xs"
            >
              <Brain className="w-3 h-3 text-purple-500" />
              <span className="text-dark-chocolate">СР</span>
              <span className="text-walnut/40">+{charStats.intelligence}</span>
            </button>
            <button 
              onClick={() => quickRollCharacteristic('Знания', charStats.knowledge)}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors text-xs"
            >
              <BookOpen className="w-3 h-3 text-amber-500" />
              <span className="text-dark-chocolate">Зн</span>
              <span className="text-walnut/40">+{charStats.knowledge}</span>
            </button>
            <button 
              onClick={() => quickRollCharacteristic('Сосредоточенность', charStats.focus)}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors text-xs"
            >
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-dark-chocolate">Сос</span>
              <span className="text-walnut/40">+{charStats.focus}</span>
            </button>
            <button 
              onClick={() => {
                const skillValue = character?.skills?.[selectedSkill] || 0;
                quickRollSkill(selectedSkill, skillValue);
              }}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-xs"
            >
              <Target className="w-3 h-3 text-green-500" />
              <span className="text-dark-chocolate">Навык</span>
              <span className="text-walnut/40">+{character?.skills?.[selectedSkill] || 0}</span>
            </button>
          </div>
          {skillsList.length > 0 && (
            <div className="mt-1.5">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-white"
              >
                {skillsList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex space-x-2 mb-4">
          <button onClick={() => setShowCheckMode(false)} className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!showCheckMode ? 'bg-caramel text-soft-ivory' : 'bg-vanilla-cream text-walnut hover:bg-caramel/10'}`}>
            Простой бросок
          </button>
          <button onClick={() => setShowCheckMode(true)} className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showCheckMode ? 'bg-caramel text-soft-ivory' : 'bg-vanilla-cream text-walnut hover:bg-caramel/10'}`}>
            Проверка (1d10 + хар-ка + навык)
          </button>
        </div>

        {!showCheckMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Тип кубика</label>
              <div className="grid grid-cols-3 gap-2">
                {['d6', 'd10', 'd100'].map(type => (
                  <button key={type} onClick={() => setDiceType(type as any)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${diceType === type ? 'bg-caramel text-soft-ivory' : 'bg-vanilla-cream text-walnut hover:bg-caramel/10'}`}>
                    <div>{type}</div>
                    <div className="text-[10px] font-normal opacity-60">{type === 'd6' ? 'стандарт' : type === 'd10' ? 'Гарри Поттер' : 'процент'}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-walnut/40 mt-1 text-center">{getDiceDescription(diceType)}</p>
            </div>

            {(diceType === 'd6' || diceType === 'd10') && (
              <div>
                <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Количество кубиков</label>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setDiceCount(Math.max(1, diceCount - 1))} className="p-2 rounded-lg bg-vanilla-cream hover:bg-caramel/10 transition-colors">
                    <Minus className="w-4 h-4 text-walnut" />
                  </button>
                  <span className="w-12 text-center text-xl font-bold text-dark-chocolate">{diceCount}</span>
                  <button onClick={() => setDiceCount(Math.min(10, diceCount + 1))} className="p-2 rounded-lg bg-vanilla-cream hover:bg-caramel/10 transition-colors">
                    <Plus className="w-4 h-4 text-walnut" />
                  </button>
                </div>
              </div>
            )}

            {diceType === 'd100' && (
              <div className="bg-vanilla-cream/50 p-3 rounded-lg text-sm text-walnut/70">
                <p>🎯 Процентный бросок от 1 до 100</p>
                <p className="text-xs mt-1 text-walnut/40">Используется для случайных событий и таблиц</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-chocolate/80 mb-1">Модификатор</label>
              <div className="flex items-center space-x-3">
                <button onClick={() => setModifier(modifier - 1)} className="p-2 rounded-lg bg-vanilla-cream hover:bg-caramel/10 transition-colors">
                  <Minus className="w-4 h-4 text-walnut" />
                </button>
                <span className="w-12 text-center text-xl font-bold text-dark-chocolate">{modifier}</span>
                <button onClick={() => setModifier(modifier + 1)} className="p-2 rounded-lg bg-vanilla-cream hover:bg-caramel/10 transition-colors">
                  <Plus className="w-4 h-4 text-walnut" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-caramel/10 p-3 rounded-lg border border-caramel/20">
              <p className="text-sm font-medium text-dark-chocolate">📖 Проверка по правилам Гарри Поттер</p>
              <p className="text-xs text-walnut/60 mt-1">Формула: 1d10 + Характеристика + Навык</p>
            </div>
            
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
              <p>🎯 Целевое значение: <span className="font-bold text-dark-chocolate">{difficulty}</span></p>
              <p className="mt-0.5">💡 1d10 + {characteristic} + {skill} {modifier !== 0 ? `+ ${modifier}` : ''}</p>
            </div>
          </div>
        )}

        <Button variant="primary" size="lg" className="w-full mt-6" onClick={handleRoll}>
          <Dice5 className="w-5 h-5 mr-2" /> Бросить!
        </Button>

        <div className="mt-4">
          <button onClick={() => setShowHistory(!showHistory)} className="flex items-center space-x-2 text-sm text-walnut/60 hover:text-caramel transition-colors">
            <History className="w-4 h-4" /> <span>История бросков ({history.length})</span>
          </button>
          {showHistory && (
            <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
              {history.length === 0 ? (
                <p className="text-xs text-walnut/40">Нет бросков</p>
              ) : (
                <>
                  <div className="flex justify-end mb-1">
                    <button onClick={handleClearHistory} className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center">
                      <Trash2 className="w-3 h-3 mr-1" /> Очистить
                    </button>
                  </div>
                  {history.slice(0, 20).map((roll) => (
                    <div key={roll.id} className="text-xs text-walnut/60 bg-vanilla-cream/30 rounded px-2 py-1">
                      <span className="text-dark-chocolate font-medium">{roll.userName}</span>: {roll.diceType} [{roll.results.join(' + ')}]
                      {roll.modifier !== 0 && ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}`} = <span className="font-bold text-caramel">{roll.total}</span>
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
