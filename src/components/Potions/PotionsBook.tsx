import { useState, useEffect } from 'react';
import { Search, X, FlaskConical, BookOpen } from 'lucide-react';
import Button from '../ui/Button';
import { loadGameData, Potion } from '../../services/dataService';

interface PotionsBookProps {
  onClose: () => void;
}

const PotionsBook = ({ onClose }: PotionsBookProps) => {
  const [potions, setPotions] = useState<Potion[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadGameData();
      setPotions(data.potions || []);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredPotions = potions.filter(potion =>
    potion.name.toLowerCase().includes(search.toLowerCase()) ||
    potion.description.toLowerCase().includes(search.toLowerCase()) ||
    potion.effect.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-soft-ivory rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-caramel/20">
          <h2 className="font-serif text-2xl font-semibold text-dark-chocolate flex items-center">
            <FlaskConical className="w-6 h-6 text-caramel mr-2" /> Зелья
            <span className="ml-2 text-sm font-normal text-walnut/40">{potions.length}</span>
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
              placeholder="Поиск зелий..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-caramel"></div>
            </div>
          ) : filteredPotions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-walnut/30">
              <BookOpen className="w-16 h-16 mb-4" />
              <p className="font-serif text-lg">Зелий не найдено</p>
            </div>
          ) : (
            filteredPotions.map((potion, index) => (
              <div key={index} className="bg-white/60 rounded-xl p-4 border border-caramel/10 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold text-dark-chocolate">{potion.name}</h3>
                    <p className="text-sm text-walnut/70 mt-1">{potion.description}</p>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="bg-vanilla-cream/50 rounded-lg px-3 py-1.5">
                        <span className="text-walnut/40">Ингредиенты:</span>
                        <span className="ml-1 text-dark-chocolate/80">{potion.ingredients}</span>
                      </div>
                      <div className="bg-vanilla-cream/50 rounded-lg px-3 py-1.5">
                        <span className="text-walnut/40">Эффект:</span>
                        <span className="ml-1 text-dark-chocolate/80">{potion.effect}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 border-t border-caramel/20 text-xs text-walnut/40 text-center">
          {filteredPotions.length} из {potions.length} зелий
        </div>
      </div>
    </div>
  );
};

export default PotionsBook;
