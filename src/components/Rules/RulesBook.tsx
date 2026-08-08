import { useState } from 'react';
import { Search, X, BookOpen, Wand2, FlaskConical, Sword, Shield, Users, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

interface RuleSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
}

const SECTIONS: RuleSection[] = [
  {
    id: 'basics',
    title: 'Основы',
    icon: <BookOpen className="w-4 h-4" />,
    content: `
# Основы игры

## Что такое НРИ?
Настольная ролевая игра — это форма совместного повествования.

## Броски кубиков
Основная механика — бросок 1d10 + характеристика + навык.

## Сложность
- Элементарная: 3+
- Простая: 6+
- Замысловатая: 12+
- Каверзная: 15+
- Грандиозная: 18+
- Пугающая: 21+
- Недостижимая: 25+
`
  },
  {
    id: 'characteristics',
    title: 'Характеристики',
    icon: <Shield className="w-4 h-4" />,
    content: `
# Характеристики

## Живучесть
Сила и физическая выносливость.

## Скорость
Рефлексы и координация.

## Сообразительность
Быстрота мышления и восприятия.

## Знания
Мудрость и накопленные знания.

## Сосредоточенность
Дисциплина и воля.
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
Открывает замки.
Сложность: 12

### Экспеллиармус
Обезоруживает противника.
Сложность: 15

### Протего
Создает защитный щит.
Сложность: 15
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
`
  },
  {
    id: 'combat',
    title: 'Бой',
    icon: <Sword className="w-4 h-4" />,
    content: `
# Бой

## Броски атаки
1d10 + Сообразительность + Навык

## Защита
Уклонение или блокирование

## Урон
Зависит от оружия и заклинания
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
        {/* Заголовок */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-caramel/20">
          <h2 className="font-serif text-2xl font-semibold text-dark-chocolate flex items-center">
            <BookOpen className="w-6 h-6 text-caramel mr-2" />
            Книга правил
          </h2>
          <button onClick={onClose} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Поиск */}
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
          {/* Список разделов */}
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

          {/* Контент */}
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
