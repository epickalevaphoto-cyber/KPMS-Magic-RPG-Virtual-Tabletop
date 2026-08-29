import { useState } from 'react';
import { Search, X, BookOpen, Wand2, FlaskConical, Shield, Users, Cat, Heart, Crown, Sparkles } from 'lucide-react';

interface RuleSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
}

const SECTIONS: RuleSection[] = [
  {
    id: 'basics',
    title: 'Основы игры',
    icon: <BookOpen className="w-4 h-4" />,
    content: `
# Основы игры

## Что такое НРИ?
Настольная ролевая игра — это форма совместного повествования, в которой игроки берут на себя роли персонажей.

## Броски кубиков
Основная механика — бросок 1d10 + характеристика + навык.

## Уровни сложности
- Элементарная: 3+
- Простая: 6+
- Замысловатая: 12+
- Каверзная: 15+
- Грандиозная: 18+
- Пугающая: 21+
- Недостижимая: 25+

## Степени успеха
- Постыдный провал: бросок < ½ сложности
- Провал: бросок < сложности
- Успех: бросок > сложности
- Впечатляющий успех: бросок > сложности × 2
- Невероятный успех: бросок > сложности × 3
`
  },
  {
    id: 'characteristics',
    title: 'Характеристики',
    icon: <Shield className="w-4 h-4" />,
    content: `
# Характеристики

## Живучесть
Ваша сила и физическая выносливость. Ваша жизненная сила.

## Скорость
Ваши рефлексы и координация. Способность быстро реагировать и двигаться.

## Сообразительность
Ваша быстрота мышления и восприятия. Аналитические качества.

## Знания
Ваша мудрость и накопленные знания. Багаж опыта.

## Сосредоточенность
Ваша дисциплина и воля. Способность контролировать магические силы.
`
  },
  {
    id: 'skills',
    title: 'Навыки',
    icon: <Users className="w-4 h-4" />,
    content: `
# Навыки

## Основные навыки
- Чары
- Защита от тёмных искусств
- Зельеварение
- Трансфигурация
- Травология
- Полёт на метле
- Дуэль

## Вспомогательные навыки
- Алхимия
- Артефакторика
- Архивариус
- Астрономия
- Баланс
- Верховая езда
- Взаимопонимание
- Изучение древних рун
- Искусство
- Исследования древности
- История магии
- Магловедение
- Маскировка
- Музыка
- Наблюдательность
- Нумерология
- Окклюменция
- Полномочия
- Право
- Прорицание
- Ремесло
- Репутация
- Скрытность
- Слежение
- Сокрытие
- Стратегия
- Схватка
- Телепортация
- Теория магии
- Тёмные искусства
- Уход за магическими существами
- Хитрость
`
  },
  {
    id: 'spells',
    title: 'Заклинания',
    icon: <Wand2 className="w-4 h-4" />,
    content: `
# Заклинания

## Основные заклинания

### Люмос
Создает свет на кончике палочки.
Сложность: 3

### Алохомора
Открывает замки и запертые двери.
Сложность: 12

### Экспеллиармус
Обезоруживает противника.
Сложность: 12

### Протего
Создает защитный щит.
Сложность: 15

### Остолбеней
Оглушает противника.
Сложность: 15

### Акцио
Призывает предмет к владельцу.
Сложность: 12

### Авада Кедавра
Вызывает мгновенную смерть. Непростительное проклятие.
Сложность: 18

### Империо
Подчиняет волю жертвы. Непростительное проклятие.
Сложность: 18

### Круциатус
Вызывает невыносимую боль. Непростительное проклятие.
Сложность: 18

## Типы заклинаний
- Чары
- Проклятия
- Сглазы
- Трансфигурация
- Контрзаклинания
`
  },
  {
    id: 'potions',
    title: 'Зелья',
    icon: <FlaskConical className="w-4 h-4" />,
    content: `
# Зелья

## Основные зелья

### Оборотное зелье
Позволяет принять облик другого человека.
Сложность: 15

### Сыворотка правды
Заставляет говорить правду.
Сложность: 18

### Феликс Фелицис
Приносит удачу.
Сложность: 18

### Укрепляющий раствор
Даёт огромную силу. +5 к Живучести.
Сложность: 12

### Умиротворяющий бальзам
Успокаивает нервы. Улучшает психическое состояние.
Сложность: 15

### Ранозаживляющее зелье
Мощный антисептик. Ускоряет заживление.
Сложность: 15
`
  },
  {
    id: 'familiars',
    title: 'Фамильяры',
    icon: <Cat className="w-4 h-4" />,
    content: `
# Фамильяры

Все ученики Хогвартса могут иметь домашнего любимца — фамильяра.

## Сова
Возможность отправлять сообщения и разведывать местность с высоты.
+1D к броску против Сокрытия.

## Кошка
Предварительная разведка помещений.
+1D к броску Скрытности.

## Жаба
Чудесное чутьё на предметы. Поиск беглянки приводит к цели.
+1D к броску поиска предметов.

## Крыса
Проникает в узкие пространства, ищет тайники.
Снижает сложность поиска проходов на 1D.

## Змея
Только для владеющих Парселтангом.
Репутация ±3. Позволяет разведывать локации.
`
  },
  {
    id: 'halfbloods',
    title: 'Полулюди',
    icon: <Heart className="w-4 h-4" />,
    content: `
# Полулюди

## Полувеликан
Естественная защита 5D против урона.
Живучесть = базовая + 2 × год обучения.
Репутация ±2.

## Полугоблин
+2 к Чарам и Ремеслу.
-1 к Живучести и Скорости.
Репутация -2.

## Полувейла
Чары очарования (зрительный контакт).
-1 к Знаниям.
Снимается Ревелио.

## Полуэльф
Заклинания без палочки со штрафом +3 вместо +9.
Репутация ±2.

## Полувампир
+1 к Скорости и Хитрости.
Чеснок +1D урона.
Репутация -2.
`
  },
  {
    id: 'lycanthropy',
    title: 'Ликантропия',
    icon: <Heart className="w-4 h-4" />,
    content: `
# Ликантропия

Магическая болезнь, превращающая человека в оборотня в полнолуние.

## Превращение
При полной луне характеристики изменяются:
- Живучесть ×2
- Скорость ×2
- Сообразительность ×1.5

## Урон
- Зубы: 3D+13
- Когти: 4D+13

## Волчье противоядие
Позволяет сохранять разум во время трансформации.
Безупречное противоядие позволяет сохранить человеческую форму при проверке:
1D + Сосредоточенность + Окклюменция (сложность 15+)
`
  },
  {
    id: 'divination',
    title: 'Прорицание',
    icon: <Sparkles className="w-4 h-4" />,
    content: `
# Прорицание

## Этапы предсказания

### 1. Выбор способа
- Астрология
- Нумерология
- Травология
- Уход за магическими существами

### 2. Подбор инвентаря
Проверка: 1D + Навык + Знания (сложность 12)

### 3. Результат
Проверка: 1D + Прорицание + Сосредоточенность (сложность 15)

## Модификаторы сложности
| Условие | Модификатор |
|---------|-------------|
| Укромное место | -1 |
| Отвлекающая обстановка | +1 |
| Спешка | +1 |
| Спокойное проведение | -1 |
| Отсутствие оборудования | +2 |
| Проведение экспертом | -2 |
| Помощь эксперта | -1 |

## Результаты
| Бросок | Результат |
|--------|-----------|
| < ½ сложности | Лживое пророчество |
| < сложности | Нет результата |
| > сложности | Верное пророчество |
| > 2× сложности | Пророчество с деталями |
`
  },
  {
    id: 'authority',
    title: 'Полномочия',
    icon: <Crown className="w-4 h-4" />,
    content: `
# Полномочия

Навык, отражающий положение в иерархической организации.

## Особенности
- Всегда имеет специализацию (Хогвартс, Министерство и т.д.)
- Не повышается сюжетными баллами
- Повышается/понижается с должностью

## Использование
- С подчинёнными: быстрая проверка
- С равными и вышестоящими: встречная проверка
- Действует только внутри организации
`
  }
];

interface RulesBookProps {
  onClose: () => void;
}

const RulesBook = ({ onClose }: RulesBookProps) => {
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState<RuleSection | null>(null);

  const filteredSections = SECTIONS.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-soft-ivory rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-caramel/20">
          <h2 className="font-serif text-2xl font-semibold text-dark-chocolate flex items-center">
            <BookOpen className="w-6 h-6 text-caramel mr-2" /> Книга правил
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
              placeholder="Поиск по правилам..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-white"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-caramel/20 overflow-y-auto p-3 space-y-1">
            {filteredSections.map(section => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                  selectedSection?.id === section.id
                    ? 'bg-caramel/10 text-caramel'
                    : 'text-walnut/70 hover:bg-krem'
                }`}
              >
                <span className="text-walnut/40">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
            {filteredSections.length === 0 && (
              <p className="text-sm text-walnut/40 text-center py-4">Ничего не найдено</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedSection ? (
              <div className="prose prose-sm max-w-none">
                {selectedSection.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="font-serif text-2xl font-bold text-dark-chocolate mt-0 mb-4">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="font-serif text-xl font-semibold text-dark-chocolate mt-6 mb-2">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="font-serif text-lg font-semibold text-dark-chocolate mt-4 mb-1">{line.slice(4)}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="text-walnut/80 ml-4">{line.slice(2)}</li>;
                  }
                  if (line.startsWith('|')) {
                    const cols = line.split('|').filter(c => c.trim());
                    if (cols.length > 1) {
                      return (
                        <div key={i} className="flex text-xs border-b border-caramel/10 py-1">
                          {cols.map((col, ci) => (
                            <span key={ci} className={`flex-1 ${ci === 0 ? 'font-medium text-dark-chocolate' : 'text-walnut/70'}`}>
                              {col.trim()}
                            </span>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return <p key={i} className="text-walnut/80">{line}</p>;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-walnut/30">
                <BookOpen className="w-16 h-16 mb-4" />
                <p className="font-serif text-lg">Выберите раздел</p>
                <p className="text-sm">Или воспользуйтесь поиском</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesBook;
