import { useState, useEffect } from 'react';
import { 
  X, Save, Edit2, Plus, Trash2, Sparkles, 
  FlaskConical, BookOpen, Sword, Shield, 
  Zap, Brain, Heart, Wind, 
  Check, ChevronDown, ChevronRight 
} from 'lucide-react';
import Button from '../ui/Button';
import { 
  Character, 
  SKILLS_LIST, 
  HOUSES, 
  ORIGINS, 
  YEARS,
  InventoryItem 
} from '../../types/character';
import { updateCharacter, updateSkill, addItem, removeItem } from '../../services/characterService';

interface CharacterSheetProps {
  character: Character;
  onClose: () => void;
  readOnly?: boolean;
}

const CharacterSheet = ({ character, onClose, readOnly = false }: CharacterSheetProps) => {
  const [char, setChar] = useState<Character>(character);
  const [isEditing, setIsEditing] = useState(!readOnly);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [showSkills, setShowSkills] = useState(true);
  const [showSpells, setShowSpells] = useState(true);
  const [showPotions, setShowPotions] = useState(true);
  const [showInventory, setShowInventory] = useState(true);

  useEffect(() => {
    setChar(character);
  }, [character]);

  const handleSave = () => {
    updateCharacter(char.id, char);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Character, value: any) => {
    setChar(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (skillName: string, value: number) => {
    if (value < 0) value = 0;
    if (value > 10) value = 10;
    updateSkill(char.id, skillName, value);
    setChar(prev => ({
      ...prev,
      skills: { ...prev.skills, [skillName]: value }
    }));
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const item: InventoryItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: newItemName.trim(),
      quantity: newItemQuantity || 1
    };
    addItem(char.id, item);
    setChar(prev => ({
      ...prev,
      inventory: [...prev.inventory, item]
    }));
    setNewItemName('');
    setNewItemQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(char.id, itemId);
    setChar(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.id !== itemId)
    }));
  };

  const usedAttributes = char.vitality + char.speed + char.intelligence + char.knowledge + char.focus;
  const maxAttributes = 11;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 border-b border-gold/20 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {char.name || 'Новый персонаж'}
            </h2>
            <span className="text-xs text-brown-dark/50 bg-gold/10 px-2 py-0.5 rounded-full">
              {char.house || 'Без факультета'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-brown-dark/60"
              >
                {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-brown-dark/60 hover:text-ink"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-brown-dark/60 mb-1">Имя</label>
              <input
                type="text"
                value={char.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing || readOnly}
                className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown-dark/60 mb-1">Возраст</label>
              <input
                type="number"
                value={char.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                disabled={!isEditing || readOnly}
                className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
                min={11}
                max={18}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown-dark/60 mb-1">Курс</label>
              <select
                value={char.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                disabled={!isEditing || readOnly}
                className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}-й курс</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brown-dark/60 mb-1">Факультет</label>
              <select
                value={char.house}
                onChange={(e) => handleChange('house', e.target.value)}
                disabled={!isEditing || readOnly}
                className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
              >
                <option value="">Выберите факультет</option>
                {HOUSES.map(h => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brown-dark/60 mb-1">Происхождение</label>
              <select
                value={char.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                disabled={!isEditing || readOnly}
                className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
              >
                <option value="">Выберите происхождение</option>
                {ORIGINS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-gold/20 rounded-xl p-4">
            <h3 className="font-serif text-lg font-semibold mb-4 flex items-center">
              <Heart className="w-5 h-5 text-gold mr-2" />
              Характеристики
              <span className="ml-auto text-sm font-normal text-brown-dark/60">
                {usedAttributes} / {maxAttributes} баллов
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-brown-dark/60 mb-1 flex items-center">
                  <Heart className="w-3 h-3 text-red-500 mr-1" /> Живучесть
                </label>
                <input
                  type="number"
                  value={char.vitality}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const newTotal = val + char.speed + char.intelligence + char.knowledge + char.focus;
                    if (newTotal <= maxAttributes && val >= 1) {
                      handleChange('vitality', val);
                    }
                  }}
                  disabled={!isEditing || readOnly}
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-dark/60 mb-1 flex items-center">
                  <Wind className="w-3 h-3 text-blue-500 mr-1" /> Скорость
                </label>
                <input
                  type="number"
                  value={char.speed}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const newTotal = char.vitality + val + char.intelligence + char.knowledge + char.focus;
                    if (newTotal <= maxAttributes && val >= 1) {
                      handleChange('speed', val);
                    }
                  }}
                  disabled={!isEditing || readOnly}
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-dark/60 mb-1 flex items-center">
                  <Brain className="w-3 h-3 text-purple-500 mr-1" /> Сообразительность
                </label>
                <input
                  type="number"
                  value={char.intelligence}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const newTotal = char.vitality + char.speed + val + char.knowledge + char.focus;
                    if (newTotal <= maxAttributes && val >= 1) {
                      handleChange('intelligence', val);
                    }
                  }}
                  disabled={!isEditing || readOnly}
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-dark/60 mb-1 flex items-center">
                  <BookOpen className="w-3 h-3 text-amber-500 mr-1" /> Знания
                </label>
                <input
                  type="number"
                  value={char.knowledge}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const newTotal = char.vitality + char.speed + char.intelligence + val + char.focus;
                    if (newTotal <= maxAttributes && val >= 1) {
                      handleChange('knowledge', val);
                    }
                  }}
                  disabled={!isEditing || readOnly}
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-dark/60 mb-1 flex items-center">
                  <Zap className="w-3 h-3 text-yellow-500 mr-1" /> Сосредоточенность
                </label>
                <input
                  type="number"
                  value={char.focus}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const newTotal = char.vitality + char.speed + char.intelligence + char.knowledge + val;
                    if (newTotal <= maxAttributes && val >= 1) {
                      handleChange('focus', val);
                    }
                  }}
                  disabled={!isEditing || readOnly}
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
                  min={1}
                  max={10}
                />
              </div>
            </div>
          </div>

          <div className="border border-gold/20 rounded-xl p-4">
            <button
              onClick={() => setShowSkills(!showSkills)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-serif text-lg font-semibold flex items-center">
                <Sword className="w-5 h-5 text-gold mr-2" />
                Навыки
              </h3>
              {showSkills ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            {showSkills && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                {SKILLS_LIST.map(skill => (
                  <div key={skill} className="flex items-center space-x-2">
                    <span className="text-xs truncate flex-1">{skill}</span>
                    <input
                      type="number"
                      value={char.skills[skill] || 0}
                      onChange={(e) => handleSkillChange(skill, parseInt(e.target.value) || 0)}
                      disabled={!isEditing || readOnly}
                      className="w-12 px-1 py-1 text-center rounded border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed text-sm"
                      min={0}
                      max={10}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-gold/20 rounded-xl p-4">
            <button
              onClick={() => setShowSpells(!showSpells)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-serif text-lg font-semibold flex items-center">
                <Sparkles className="w-5 h-5 text-gold mr-2" />
                Заклинания
              </h3>
              {showSpells ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            {showSpells && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {char.spells.map((spell, index) => (
                    <span key={index} className="bg-gold/10 px-3 py-1 rounded-full text-sm flex items-center">
                      {spell}
                      {isEditing && !readOnly && (
                        <button
                          onClick={() => {
                            const newSpells = char.spells.filter((_, i) => i !== index);
                            handleChange('spells', newSpells);
                          }}
                          className="ml-1 text-brown-dark/40 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && !readOnly && (
                  <div className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Добавить заклинание..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleChange('spells', [...char.spells, e.currentTarget.value.trim()]);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-1 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors text-sm"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Добавить заклинание..."]') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleChange('spells', [...char.spells, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border border-gold/20 rounded-xl p-4">
            <button
              onClick={() => setShowPotions(!showPotions)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-serif text-lg font-semibold flex items-center">
                <FlaskConical className="w-5 h-5 text-gold mr-2" />
                Зелья
              </h3>
              {showPotions ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            {showPotions && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {char.potions.map((potion, index) => (
                    <span key={index} className="bg-gold/10 px-3 py-1 rounded-full text-sm flex items-center">
                      {potion}
                      {isEditing && !readOnly && (
                        <button
                          onClick={() => {
                            const newPotions = char.potions.filter((_, i) => i !== index);
                            handleChange('potions', newPotions);
                          }}
                          className="ml-1 text-brown-dark/40 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && !readOnly && (
                  <div className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Добавить зелье..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleChange('potions', [...char.potions, e.currentTarget.value.trim()]);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-1 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors text-sm"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Добавить зелье..."]') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleChange('potions', [...char.potions, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border border-gold/20 rounded-xl p-4">
            <button
              onClick={() => setShowInventory(!showInventory)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-serif text-lg font-semibold flex items-center">
                <BookOpen className="w-5 h-5 text-gold mr-2" />
                Инвентарь
              </h3>
              {showInventory ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            {showInventory && (
              <div className="mt-4">
                <div className="space-y-1">
                  {char.inventory.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-krem/30 px-3 py-2 rounded-lg">
                      <span className="text-sm">
                        {item.name} {item.quantity > 1 && <span className="text-brown-dark/40 text-xs">x{item.quantity}</span>}
                      </span>
                      {isEditing && !readOnly && (
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-brown-dark/40 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && !readOnly && (
                  <div className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Название предмета..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1 px-3 py-1 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors text-sm"
                    />
                    <input
                      type="number"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors text-sm text-center"
                      min={1}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAddItem}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border border-gold/20 rounded-xl p-4">
            <h3 className="font-serif text-lg font-semibold flex items-center">
              <Shield className="w-5 h-5 text-gold mr-2" />
              Сюжетные баллы
            </h3>
            <div className="mt-2">
              <input
                type="number"
                value={char.storyPoints}
                onChange={(e) => handleChange('storyPoints', parseInt(e.target.value) || 0)}
                disabled={!isEditing || readOnly}
                className="w-32 px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gold/20 rounded-xl p-4">
            <div>
              <h4 className="text-sm font-medium text-brown-dark/60 mb-1">Физическое состояние</h4>
              <input
                type="text"
                value={char.physicalState}
                onChange={(e) => handleChange('physicalState', e.target.value)}
                disabled={!isEditing || readOnly}
                className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-brown-dark/60 mb-1">Психическое состояние</h4>
              <input
                type="text"
                value={char.mentalState}
                onChange={(e) => handleChange('mentalState', e.target.value)}
                disabled={!isEditing || readOnly}
                className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none transition-colors disabled:bg-krem/50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gold/20 px-6 py-4 flex justify-end space-x-3">
          {isEditing && !readOnly && (
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
