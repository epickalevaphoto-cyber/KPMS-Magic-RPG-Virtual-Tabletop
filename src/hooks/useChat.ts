import { useState, useEffect } from 'react';
import { ChatMessage } from '../components/chat/Chat';

// Хранилище сообщений в localStorage
const STORAGE_KEY = 'kpms_chat_messages';

function loadMessages(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading chat messages:', e);
  }
  return [];
}

function saveMessages(messages: ChatMessage[]): void {
  try {
    // Храним только последние 200 сообщений
    if (messages.length > 200) {
      messages = messages.slice(-200);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving chat messages:', e);
  }
}

// Множество для отслеживания уже отправленных системных сообщений
const sentSystemMessages = new Set<string>();

export function useChat(roomCode: string, userName: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Загрузка сообщений при монтировании
  useEffect(() => {
    const loaded = loadMessages();
    // Фильтруем только сообщения для этой комнаты
    const roomMessages = loaded.filter(m => m.userId === roomCode);
    setMessages(roomMessages);
    setIsInitialized(true);
  }, [roomCode]);

  // Сохранение при изменении
  useEffect(() => {
    if (isInitialized) {
      const allMessages = loadMessages();
      const otherMessages = allMessages.filter(m => m.userId !== roomCode);
      saveMessages([...otherMessages, ...messages]);
    }
  }, [messages, roomCode, isInitialized]);

  const sendMessage = (text: string, type: 'message' | 'roll' | 'system' = 'message') => {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: roomCode,
      userName: userName || 'Игрок',
      text: text,
      timestamp: Date.now(),
      type: type
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const sendRollMessage = (text: string) => {
    return sendMessage(text, 'roll');
  };

  const sendSystemMessage = (text: string) => {
    // Создаем уникальный ключ для сообщения
    const messageKey = `${roomCode}_${text}`;
    
    // Проверяем, не было ли уже отправлено такое сообщение
    if (sentSystemMessages.has(messageKey)) {
      console.log('⚠️ Системное сообщение уже отправлено:', text);
      return null;
    }
    
    // Отмечаем как отправленное
    sentSystemMessages.add(messageKey);
    
    // Отправляем сообщение
    return sendMessage(text, 'system');
  };

  const clearMessages = () => {
    setMessages([]);
    const allMessages = loadMessages();
    const otherMessages = allMessages.filter(m => m.userId !== roomCode);
    saveMessages(otherMessages);
    // Очищаем кэш системных сообщений
    sentSystemMessages.clear();
  };

  // Очистка кэша при размонтировании
  useEffect(() => {
    return () => {
      // Очищаем только сообщения этой комнаты, но не системные
    };
  }, []);

  return {
    messages,
    sendMessage,
    sendRollMessage,
    sendSystemMessage,
    clearMessages
  };
}
