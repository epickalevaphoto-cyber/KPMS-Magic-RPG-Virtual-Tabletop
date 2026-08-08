import { useState, useEffect } from 'react';
import { ChatMessage } from '../services/supabase';
import { getMessagesSupabase, sendMessageSupabase, subscribeToMessagesSupabase } from '../services/supabase';

export function useSupabaseChat(roomCode: string, userId: string, userName: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomCode) return;

    let isMounted = true;

    const loadMessages = async () => {
      try {
        const loaded = await getMessagesSupabase(roomCode);
        if (isMounted) {
          setMessages(loaded);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    const subscription = subscribeToMessagesSupabase(roomCode, (newMessage) => {
      if (isMounted) {
        setMessages(prev => [...prev, newMessage]);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [roomCode]);

  const send = async (text: string, type: 'message' | 'roll' | 'system' = 'message') => {
    if (!text.trim()) return null;
    
    const message = await sendMessageSupabase(roomCode, userId, userName, text.trim(), type);
    return message;
  };

  const sendRoll = (text: string) => send(text, 'roll');
  const sendSystem = (text: string) => send(text, 'system');

  return {
    messages,
    send,
    sendRoll,
    sendSystem,
    isConnected
  };
}
