import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Map, Settings, Wand2, BookOpen, Sparkles, FlaskConical, Dice5 } from 'lucide-react';
import Button from '../components/ui/Button';

const Master: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen bg-krem">
      <header className="flex justify-between items-center px-6 py-3 border-b border-gold/20 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-xl text-ink">KPMS</span>
          <span className="text-xs text-brown-dark/50 bg-gold/10 px-2 py-0.5 rounded-full">Мастер</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-brown-dark/60 hover:text-ink">
            <Users className="w-4 h-4 mr-1" /> Игроки
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-brown-dark/60 hover:text-ink">
            <LogOut className="w-4 h-4 mr-1" /> Выйти
          </Button>
        </div>
      </header>

      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        <div className="w-16 bg-white/40 backdrop-blur-sm rounded-xl border border-gold/20 flex flex-col items-center py-4 space-y-4 shadow-lg">
          <button className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors" title="Игроки">
            <Users className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Карта">
            <Map className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Правила">
            <BookOpen className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Заклинания">
            <Sparkles className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Зелья">
            <FlaskConical className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-brown-dark/60 hover:text-gold hover:bg-gold/10 transition-colors" title="Настройки">
            <Settings className="w-6 h-6" />
          </button>
          <div className="flex-1"></div>
          <button className="p-2 rounded-lg bg-gold text-white hover:bg-gold-dark transition-colors shadow-lg" title="Бросок">
            <Dice5 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 relative bg-brown-dark/5 rounded-xl border border-gold/20 shadow-inner overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-brown-dark/30">
            <div className="text-center">
              <p className="text-6xl mb-4">🗺️</p>
              <p className="font-serif text-2xl">Карта Мастера</p>
              <p className="text-sm">Туман войны, токены, заметки</p>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-gold/20 p-3 w-48">
            <p className="text-xs font-semibold text-brown-dark/70 border-b border-gold/20 pb-1 mb-2">Игроки в сессии</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Анна</span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Том</span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Мария</span>
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Master;
