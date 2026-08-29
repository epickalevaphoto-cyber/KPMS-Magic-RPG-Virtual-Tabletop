import { Character, InventoryItem } from '../types/character';

const STORAGE_KEY = 'kpms_characters';

function loadCharacters(): Map<string, Character> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return new Map(Object.entries(data));
    }
  } catch (e) { console.error('Error loading characters:', e); }
  return new Map();
}

function saveCharacters(characters: Map<string, Character>): void {
  try {
    const data = Object.fromEntries(characters);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.error('Error saving characters:', e); }
}

let characters: Map<string, Character> = loadCharacters();

export function createCharacter(userId: string, roomId: string, name: string): Character {
  const character: Character = {
    id: `char_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    roomId,
    name: name || 'Новый персонаж',
    age: 11,
    year: 1,
    house: '',
    origin: '',
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
  saveCharacters(characters);
  return character;
}

export function getCharacter(id: string): Character | null {
  return characters.get(id) || null;
}

export function getCharactersByRoom(roomId: string): Character[] {
  return Array.from(characters.values()).filter(c => c.roomId === roomId);
}

export function getCharacterByUser(userId: string, roomId: string): Character | null {
  return Array.from(characters.values()).find(c => c.userId === userId && c.roomId === roomId) || null;
}

export function updateCharacter(id: string, updates: Partial<Character>): Character | null {
  const character = characters.get(id);
  if (!character) return null;
  const updated = { ...character, ...updates };
  characters.set(id, updated);
  saveCharacters(characters);
  return updated;
}

export function updateSkill(characterId: string, skillName: string, value: number): Character | null {
  const character = characters.get(characterId);
  if (!character) return null;
  character.skills[skillName] = value;
  characters.set(characterId, character);
  saveCharacters(characters);
  return character;
}

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
  saveCharacters(characters);
  return character;
}

export function removeItem(characterId: string, itemId: string): Character | null {
  const character = characters.get(characterId);
  if (!character) return null;
  character.inventory = character.inventory.filter(i => i.id !== itemId);
  characters.set(characterId, character);
  saveCharacters(characters);
  return character;
}

export function deleteCharacter(id: string): boolean {
  const result = characters.delete(id);
  if (result) saveCharacters(characters);
  return result;
}
