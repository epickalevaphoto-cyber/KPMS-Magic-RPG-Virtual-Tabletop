import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Sparkles, FlaskConical, Dice5, Backpack, Settings } from 'lucide-react';
import Button from '../components/ui/Button';

const Player: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen bg-krem">
      <header className="flex justify-between items-center px-6 py-3 border-b border-gold/20 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-xl text-ink">KPMS</span>
          <span className="text-xs text-brown-dark/50 bg-gold/10 px-2 py-0.5 rounded-full">Игрок</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-brown-dark/60 hover:text-ink">
          <LogOut className="w-4 h-4 mr-1" /> Выйти
        </Button>
      </header>

      <main className="flex-1 relative bg-brown-dark/5 m-2 rounded-xl border border-gold/20 shadow-inner overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-brown-dark/30">
          <div className="text-center">
            <p className="text-6xl mb-4">🗺️</p>
            <p className="font-serif text-2xl">Игровая карта</p>
            <p className="text-sm">Здесь будет отображаться игровая карта</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-white/60 backdrop-blur-sm rounded-lg shadow-lg border border-gold/20 p-3 flex flex-col">
          <p className="text-xs font-semibold text-brown-dark/70 border-b border-gold/20 pb-1 mb-2">Чат</p>
          <div className="flex-1 overflow-y-auto text-xs space-y-1 text-brown-dark/60">
            <p>Добро пожаловать в игру!</p>
            <p>Мастер: Вы просыпаетесь в Большом зале...</p>
          </div>
          <input type="text" placeholder="Написать..." className="mt-2 w-full text-xs rounded border border-gold/30 bg-transparent px-2 py-1 focus:outline-none focus:border-gold" />
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-gold/20 p-2 flex justify-around items-center">
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Правила</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Заклинания</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <FlaskConical className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Зелья</span>
        </button>
        <button className="flex flex-col items-center text-gold relative">
          <div className="w-12 h-12 -mt-4 bg-gold rounded-full flex items-center justify-center shadow-lg hover:bg-gold-dark transition-colors">
            <Dice5 className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-medium mt-0.5 text-ink">Бросок</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <Backpack className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Инвентарь</span>
        </button>
        <button className="flex flex-col items-center text-brown-dark/60 hover:text-gold transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Настройки</span>
        </button>
      </footer>
    </div>
  );
};

export default Player;
