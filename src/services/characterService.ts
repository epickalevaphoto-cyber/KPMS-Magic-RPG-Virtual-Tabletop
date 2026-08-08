import { Character, InventoryItem, SKILLS_LIST } from '../types/character';

// Хранилище персонажей
let characters: Map<string, Character> = new Map();

// Создание нового персонажа
export function createCharacter(
  userId: string,
  roomId: string,
  name: string
): Character {
  const character: Character = {
    id: `char_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    roomId,
    name: name || 'Новый персонаж',
    age: 11,
    year: 1,
    house: '',
    origin: '',
    
    // 11 баллов для распределения
    vitality: 1,
    speed: 1,
    intelligence: 1,
    knowledge: 1,
    focus: 1,
    
    physicalState: 'Здоров',
    mentalState: 'Спокоен',
    
    skills: {},
    spells: [],
    potions: [],
    inventory: [],
    storyPoints: 0,
    reputation: {}
  };

  characters.set(character.id, character);
  return character;
}

// Получение персонажа по ID
export function getCharacter(id: string): Character | null {
  return characters.get(id) || null;
}

// Получение персонажей в комнате
export function getCharactersByRoom(roomId: string): Character[] {
  return Array.from(characters.values()).filter(c => c.roomId === roomId);
}

// Получение персонажа по userId и roomId
export function getCharacterByUser(userId: string, roomId: string): Character | null {
  return Array.from(characters.values()).find(
    c => c.userId === userId && c.roomId === roomId
  ) || null;
}

// Обновление персонажа
export function updateCharacter(id: string, updates: Partial<Character>): Character | null {
  const character = characters.get(id);
  if (!character) return null;
  
  const updated = { ...character, ...updates };
  characters.set(id, updated);
  return updated;
}

// Обновление навыков
export function updateSkill(characterId: string, skillName: string, value: number): Character | null {
  const character = characters.get(characterId);
  if (!character) return null;
  
  character.skills[skillName] = value;
  characters.set(characterId, character);
  return character;
}

// Добавление заклинания
export function addSpell(characterId: string, spell: string): Character | null {
  const character = characters.get(characterId);
  if (!character) return null;
  
  if (!character.spells.includes(spell)) {
    character.spells.push(spell);
    characters.set(characterId, character);
  }
  return character;
}

// Удаление заклинания
export function removeSpell(characterId: string, spell: string): Character | null {
  const character = characters.get(characterId);
  if (!character) return null;
  
  character.spells = character.spells.filter(s => s !== spell);
  characters.set(characterId, character);
  return character;
}

// Добавление предмета в инвентарь
export function addItem(characterId: string, item: InventoryItem): Character | null {
  const character = characters.get(characterId);
  if (!character) return null;
  
  const existing = character.inventory.find(i => i.name === item.name);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    character.inventory.push(item);
  }
  
  characters.set(characterId, character);
  return character;
}

// Удаление предмета из инвентаря
export function removeItem(characterId: string, itemId: string): Character | null {
  const character = characters.get(characterId);
  if (!character) return null;
  
  character.inventory = character.inventory.filter(i => i.id !== itemId);
  characters.set(characterId, character);
  return character;
}

// Распределение характеристик (11 баллов)
export function distributeAttributes(
  characterId: string,
  vitality: number,
  speed: number,
  intelligence: number,
  knowledge: number,
  focus: number
): Character | null {
  const total = vitality + speed + intelligence + knowledge + focus;
  if (total !== 11) return null;
  if (vitality < 1 || speed < 1 || intelligence < 1 || knowledge < 1 || focus < 1) return null;
  
  return updateCharacter(characterId, { vitality, speed, intelligence, knowledge, focus });
}

// Удаление персонажа
export function deleteCharacter(id: string): boolean {
  return characters.delete(id);
}
