import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-krem">
      <div className="text-center max-w-3xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-serif text-7xl md:text-8xl font-bold text-ink tracking-wider mb-2 magic-text">
            KPMS
          </h1>
          <div className="w-24 h-0.5 bg-gold mx-auto my-4"></div>
          <p className="text-lg md:text-xl text-brown-dark/80 font-light tracking-widest uppercase">
            Magic RPG Virtual Tabletop
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="flex flex-col items-center justify-center p-8 hover:shadow-2xl transition-shadow duration-300 cursor-pointer group border-gold/20 hover:border-gold/60">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <Wand2 className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-2">Создать игру</h2>
            <p className="text-brown-dark/70 text-sm mb-6">Начните новое приключение</p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/master')}>
              Создать
            </Button>
          </Card>

          <Card className="flex flex-col items-center justify-center p-8 hover:shadow-2xl transition-shadow duration-300 cursor-pointer group border-gold/20 hover:border-gold/60">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <Users className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-2">Войти в игру</h2>
            <p className="text-brown-dark/70 text-sm mb-6">Присоединиться к сессии</p>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/player')}>
              Войти
            </Button>
          </Card>
        </div>

        <div className="mt-8 text-brown-dark/40 text-sm tracking-wider">
          <span>✦ Версия 0.1 ✦</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
