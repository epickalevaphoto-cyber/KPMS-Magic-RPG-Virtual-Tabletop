import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  type: 'message' | 'roll' | 'system';
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUserName?: string;
  className?: string;
  maxHeight?: string;
}

const Chat = ({ 
  messages, 
  onSendMessage, 
  currentUserName = 'Игрок',
  className = '',
  maxHeight = '300px'
}: ChatProps) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getMessageStyle = (message: ChatMessage) => {
    switch (message.type) {
      case 'roll':
        return 'bg-caramel/10 border-caramel/20';
      case 'system':
        return 'bg-walnut/5 border-walnut/10 text-walnut/60 italic';
      default:
        return 'bg-soft-ivory/50 border-caramel/10';
    }
  };

  const getMessageIcon = (message: ChatMessage) => {
    switch (message.type) {
      case 'roll':
        return '🎲';
      case 'system':
        return '📢';
      default:
        return '💬';
    }
  };

  return (
    <div className={`flex flex-col bg-white/40 backdrop-blur-sm rounded-xl border border-caramel/20 overflow-hidden ${className}`}>
      <div className="flex items-center space-x-2 px-4 py-2 border-b border-caramel/20 bg-soft-ivory/50">
        <MessageSquare className="w-4 h-4 text-caramel" />
        <span className="text-sm font-medium text-dark-chocolate">Чат</span>
        <span className="text-xs text-walnut/40 ml-auto">{messages.length} сообщений</span>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-3 space-y-1.5"
        style={{ maxHeight }}
      >
        {messages.length === 0 ? (
          <p className="text-xs text-walnut/40 text-center py-4">Нет сообщений</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 p-2 rounded-lg border ${getMessageStyle(message)}`}
            >
              <span className="text-sm flex-shrink-0">{getMessageIcon(message)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-dark-chocolate">{message.userName}</span>
                  <span className="text-[10px] text-walnut/40">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-dark-chocolate/80 break-words">
                  {message.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < message.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-caramel/20 p-3 bg-soft-ivory/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Сообщение как ${currentUserName}...`}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-caramel/30 focus:border-caramel focus:outline-none transition-colors bg-soft-ivory"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
