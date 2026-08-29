export interface Character {
  id: string;
  userId: string;
  roomId: string;
  name: string;
  age: number;
  year: number;
  house: 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin' | '';
  origin: 'Muggle-born' | 'Half-blood' | 'Pure-blood' | '';
  vitality: number;
  speed: number;
  intelligence: number;
  knowledge: number;
  focus: number;
  physicalState: string;
  mentalState: string;
  skills: { [key: string]: number };
  spells: string[];
  potions: string[];
  inventory: InventoryItem[];
  storyPoints: number;
  reputation: { [key: string]: number };
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  description?: string;
}

export const SKILLS_LIST = [
  'Алхимия', 'Артефакторика', 'Архивариус', 'Астрономия',
  'Баланс', 'Верховая езда', 'Взаимопонимание', 'Дуэль',
  'Защита от тёмных искусств', 'Зельеварение', 'Знание волшебных палочек',
  'Изучение древних рун', 'Искусство', 'Исследования древности',
  'История магии', 'Магловедение', 'Маскировка', 'Музыка',
  'Наблюдательность', 'Нумерология', 'Окклюменция', 'Полёт на метле',
  'Полномочия', 'Право', 'Прорицание', 'Ремесло', 'Репутация',
  'Скрытность', 'Слежение', 'Сокрытие', 'Стратегия', 'Схватка',
  'Телепортация', 'Теория магии', 'Травология', 'Трансфигурация',
  'Тёмные искусства', 'Уход за магическими существами', 'Хитрость', 'Чары',
  'Любопытные факты'
];

export const HOUSES = [
  { value: 'Gryffindor', label: 'Гриффиндор', color: '#AE0000' },
  { value: 'Hufflepuff', label: 'Пуффендуй', color: '#FFD700' },
  { value: 'Ravenclaw', label: 'Когтевран', color: '#0E1A40' },
  { value: 'Slytherin', label: 'Слизерин', color: '#1A472A' }
];

export const ORIGINS = [
  { value: 'Muggle-born', label: 'Маглорождённый' },
  { value: 'Half-blood', label: 'Полукровка' },
  { value: 'Pure-blood', label: 'Чистокровный' }
];

export const YEARS = [1, 2, 3, 4, 5, 6, 7];
