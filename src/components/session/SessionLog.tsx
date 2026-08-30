import { useState, useEffect } from 'react';
import { X, Clock, FileText, Download, Trash2, Sparkles, Sword, Gift } from 'lucide-react';
import Button from '../ui/Button';

interface LogEntry {
  id: string;
  timestamp: number;
  type: 'message' | 'roll' | 'system' | 'combat' | 'discovery' | 'item';
  text: string;
  userId: string;
  userName: string;
}

interface SessionLogProps {
  roomCode: string;
  onClose: () => void;
}

const SessionLog = ({ roomCode, onClose }: SessionLogProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`log_${roomCode}`);
    if (saved) setLogs(JSON.parse(saved));
  }, [roomCode]);

  const clearLogs = () => {
    if (window.confirm('Очистить историю сессии?')) {
      setLogs([]);
      localStorage.removeItem(`log_${roomCode}`);
    }
  };

  const exportLogs = () => {
    const text = logs.map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.userName}: ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_log_${roomCode}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'roll': return '🎲';
      case 'system': return '📢';
      case 'combat': return '⚔️';
      case 'discovery': return '🔍';
      case 'item': return '🎒';
      default: return '💬';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'roll': return 'bg-caramel/10 border-caramel/20';
      case 'system': return 'bg-walnut/5 border-walnut/10';
      case 'combat': return 'bg-red-100/50 border-red-200';
      case 'discovery': return 'bg-green-100/50 border-green-200';
      case 'item': return 'bg-blue-100/50 border-blue-200';
      default: return 'bg-soft-ivory/50 border-caramel/10';
    }
  };

  // Группировка по датам
  const groupedLogs = logs.reduce((groups: { [key: string]: LogEntry[] }, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {});

  return (
    <div className="fixed inset-0 bg-dark-chocolate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-soft-ivory rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-caramel/20">
          <h2 className="font-serif text-2xl font-semibold text-dark-chocolate flex items-center">
            <FileText className="w-6 h-6 text-caramel mr-2" /> Сводка сессии
            <span className="ml-2 text-sm font-normal text-walnut/40">{logs.length} событий</span>
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={exportLogs} className="text-walnut/60 hover:text-caramel">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={clearLogs} className="text-red-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
            <button onClick={onClose} className="text-walnut/50 hover:text-dark-chocolate transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-walnut/30">
              <Clock className="w-16 h-16 mb-4" />
              <p className="font-serif text-lg">История пуста</p>
              <p className="text-sm">Действия игроков будут появляться здесь</p>
              <p className="text-xs mt-2 text-walnut/20">Броски кубиков, системные сообщения, боевые события</p>
            </div>
          ) : (
            Object.entries(groupedLogs).map(([date, dateLogs]) => (
              <div key={date}>
                <div className="text-xs text-walnut/40 font-medium mb-2 border-b border-caramel/10 pb-1">
                  {date}
                </div>
                {dateLogs.map(log => (
                  <div key={log.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${getTypeColor(log.type)}`}>
                    <span className="text-lg">{getTypeIcon(log.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-dark-chocolate">{log.userName}</span>
                        <span className="text-xs text-walnut/40">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-dark-chocolate/80 break-words">{log.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 border-t border-caramel/20 text-xs text-walnut/40 text-center flex justify-between">
          <span>Всего записей: {logs.length}</span>
          <span>Типы: 💬 {logs.filter(l => l.type === 'message').length} | 🎲 {logs.filter(l => l.type === 'roll').length} | 📢 {logs.filter(l => l.type === 'system').length}</span>
        </div>
      </div>
    </div>
  );
};

export default SessionLog;
