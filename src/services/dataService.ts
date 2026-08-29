export interface Spell {
  name: string;
  description: string;
  difficulty: number;
  type: string;
}

export interface Potion {
  name: string;
  description: string;
  ingredients: string;
  effect: string;
}

export interface Item {
  name: string;
  description: string;
  price: string;
}

export interface NPC {
  name: string;
  description: string;
  stats: string;
  role: string;
}

export interface Scene {
  name: string;
  description: string;
  location: string;
  npcs: string;
}

export interface GameData {
  spells: Spell[];
  potions: Potion[];
  items: Item[];
  npcs: NPC[];
  scenes: Scene[];
}

let cachedData: GameData | null = null;

export async function loadGameData(): Promise<GameData> {
  if (cachedData) return cachedData;
  try {
    const response = await fetch('/data.json');
    if (!response.ok) throw new Error('Не удалось загрузить данные');
    const data = await response.json();
    cachedData = data;
    return data;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return { spells: [], potions: [], items: [], npcs: [], scenes: [] };
  }
}

export function getCachedData(): GameData | null { return cachedData; }

export function searchSpells(query: string): Spell[] {
  if (!cachedData) return [];
  const q = query.toLowerCase();
  return cachedData.spells.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));
}

export function searchPotions(query: string): Potion[] {
  if (!cachedData) return [];
  const q = query.toLowerCase();
  return cachedData.potions.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.effect.toLowerCase().includes(q));
}

export function searchItems(query: string): Item[] {
  if (!cachedData) return [];
  const q = query.toLowerCase();
  return cachedData.items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
}

export function searchNPCs(query: string): NPC[] {
  if (!cachedData) return [];
  const q = query.toLowerCase();
  return cachedData.npcs.filter(n => n.name.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.role.toLowerCase().includes(q));
}
