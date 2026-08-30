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

export interface Plant {
  name: string;
  description: string;
  habitat: string;
  effect: string;
}

export interface Creature {
  name: string;
  description: string;
  habitat: string;
  stats: string;
  effect: string;
}

export interface Artifact {
  name: string;
  description: string;
  level: string;
  difficulty: number;
  effect: string;
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

export interface Familiar {
  name: string;
  description: string;
  effect: string;
}

export interface HalfBlood {
  name: string;
  description: string;
  effects: string;
}

export interface BloodCurse {
  name: string;
  description: string;
  effect: string;
}

export interface FamilyPrivilege {
  name: string;
  description: string;
}

export interface Lycanthropy {
  name: string;
  description: string;
  symptoms: string;
  damage: string;
  cure: string;
}

export interface Divination {
  stages: string[];
  modifiers: Record<string, number>;
  results: Record<string, string>;
}

export interface Authority {
  name: string;
  description: string;
  rules: string;
  advancement: string;
}

export interface GameData {
  spells: Spell[];
  potions: Potion[];
  plants: Plant[];
  creatures: Creature[];
  artifacts: Artifact[];
  npcs: NPC[];
  scenes: Scene[];
  familiars: Familiar[];
  halfBloods: HalfBlood[];
  bloodCurses: BloodCurse[];
  familyPrivileges: FamilyPrivilege[];
  lycanthropy: Lycanthropy;
  divination: Divination;
  authority: Authority;
}

let cachedData: GameData | null = null;

// Демо-данные на случай, если файл не загружается
function getDemoData(): GameData {
  return {
    spells: [
      { name: 'Люмос', description: 'Создает свет на кончике палочки', difficulty: 3, type: 'Чары' },
      { name: 'Алохомора', description: 'Открывает замки', difficulty: 12, type: 'Чары' },
      { name: 'Экспеллиармус', description: 'Обезоруживает противника', difficulty: 12, type: 'Проклятие' },
      { name: 'Протего', description: 'Создает защитный щит', difficulty: 15, type: 'Чары' }
    ],
    potions: [
      { name: 'Оборотное зелье', description: 'Позволяет принять облик другого человека', ingredients: 'Волосы, корень асфоделя', effect: 'Изменение внешности' },
      { name: 'Сыворотка правды', description: 'Заставляет говорить правду', ingredients: 'Сок мандрагоры', effect: 'Невозможность солгать' }
    ],
    plants: [],
    creatures: [],
    artifacts: [],
    npcs: [],
    scenes: [],
    familiars: [],
    halfBloods: [],
    bloodCurses: [],
    familyPrivileges: [],
    lycanthropy: {
      name: 'Ликантропия',
      description: 'Магическая болезнь, превращающая человека в оборотня в полнолуние.',
      symptoms: 'Волчье противоядие сохраняет разум. В полнолуние: Живучесть ×2, Скорость ×2, Сообразительность ×1.5',
      damage: 'Зубы 3D+13, Когти 4D+13',
      cure: 'Волчье противоядие. Безупречное позволяет сохранить человеческую форму при проверке 1D+Сосредоточенность+Окклюменция (15+)'
    },
    divination: {
      stages: [
        'Выбор способа предсказания (Астрология, Нумерология, Травология)',
        'Подбор инвентаря (1D+Навык+Знания, сложность 12)',
        'Определение результата (1D+Прорицание+Сосредоточенность, сложность 15)'
      ],
      modifiers: {
        'Укромное место': -1,
        'Отвлекающая обстановка': +1,
        'Спешка': +1,
        'Спокойное проведение': -1,
        'Отсутствие оборудования': +2,
        'Проведение экспертом': -2,
        'Помощь эксперта': -1
      },
      results: {
        '< 1/2 Сложности': 'Лживое пророчество',
        '< Сложности': 'Нет результата',
        '> Сложности': 'Верное пророчество',
        '> 2× Сложности': 'Пророчество с деталями'
      }
    },
    authority: {
      name: 'Полномочия',
      description: 'Навык, отражающий положение в иерархии. Всегда имеет специализацию.',
      rules: 'Действует только в рамках организации. С подчинёнными — быстрая проверка. С равными и вышестоящими — встречная проверка.',
      advancement: 'Не повышается сюжетными баллами. Повышается или понижается с должностью.'
    }
  };
}

export async function loadGameData(): Promise<GameData> {
  if (cachedData) return cachedData;
  try {
    const response = await fetch('/data.json');
    if (!response.ok) {
      console.error('❌ Не удалось загрузить data.json:', response.status);
      return getDemoData();
    }
    const data = await response.json();
    cachedData = data;
    return data;
  } catch (error) {
    console.error('❌ Ошибка загрузки данных:', error);
    return getDemoData();
  }
}

export function getCachedData(): GameData | null {
  return cachedData;
}
