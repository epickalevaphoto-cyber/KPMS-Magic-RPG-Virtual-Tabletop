export async function loadGameData(): Promise<GameData> {
  if (cachedData) return cachedData;
  try {
    // Используем относительный путь
    const response = await fetch('/data.json');
    if (!response.ok) {
      console.error('❌ Не удалось загрузить data.json:', response.status);
      // Возвращаем демо-данные
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

// Демо-данные на случай, если файл не загружается
function getDemoData(): GameData {
  return {
    spells: [
      { name: 'Люмос', description: 'Создает свет на кончике палочки', difficulty: 3, type: 'Чары' },
      { name: 'Алохомора', description: 'Открывает замки', difficulty: 12, type: 'Чары' },
      { name: 'Экспеллиармус', description: 'Обезоруживает противника', difficulty: 12, type: 'Проклятие' },
      { name: 'Протего', description: 'Создает защитный щит', difficulty: 15, type: 'Чары' },
      { name: 'Авада Кедавра', description: 'Вызывает мгновенную смерть', difficulty: 18, type: 'Проклятие' }
    ],
    potions: [
      { name: 'Оборотное зелье', description: 'Позволяет принять облик другого человека', ingredients: 'Волосы, корень асфоделя', effect: 'Изменение внешности' },
      { name: 'Сыворотка правды', description: 'Заставляет говорить правду', ingredients: 'Сок мандрагоры', effect: 'Невозможность солгать' }
    ],
    items: [],
    npcs: [],
    scenes: []
  };
}
