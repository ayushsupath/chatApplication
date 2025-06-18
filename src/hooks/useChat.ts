import { useState, useEffect, useCallback } from 'react';
import { User, Message, Chat } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online'
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'away'
  },
  {
    id: '3',
    name: 'Carol Davis',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online'
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000)
  }
];

export const useChat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Initialize chats based on logged-in user
  useEffect(() => {
    if (!user) return;

    // Create chats with other users (excluding current user)
    const otherUsers = mockUsers.filter(u => u.id !== user.id);
    
    const initialChats: Chat[] = otherUsers.map((otherUser, index) => ({
      id: `chat-${user.id}-${otherUser.id}`,
      name: otherUser.name,
      type: 'direct',
      participants: [otherUser],
      lastMessage: index === 0 ? {
        id: '1',
        senderId: otherUser.id,
        content: 'Hey! How are you doing today?',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      } : undefined,
      unreadCount: index === 0 ? 2 : 0
    }));

    // Add a group chat
    initialChats.push({
      id: 'group-1',
      name: 'Design Team',
      type: 'group',
      participants: otherUsers.slice(0, 2),
      lastMessage: {
        id: '2',
        senderId: otherUsers[0].id,
        content: 'The new mockups look great!',
        timestamp: new Date(Date.now() - 600000),
        type: 'text'
      },
      unreadCount: 0,
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    });

    setChats(initialChats);

    // Initialize messages for the first chat
    if (initialChats.length > 0) {
      const firstChatId = initialChats[0].id;
      const firstChatParticipant = initialChats[0].participants[0];
      
      setMessages({
        [firstChatId]: [
          {
            id: '1',
            senderId: firstChatParticipant.id,
            content: 'Hey! How are you doing today?',
            timestamp: new Date(Date.now() - 300000),
            type: 'text'
          },
          {
            id: '2',
            senderId: user.id,
            content: 'I\'m doing great! Just working on some new projects.',
            timestamp: new Date(Date.now() - 240000),
            type: 'text'
          },
          {
            id: '3',
            senderId: firstChatParticipant.id,
            content: 'That sounds exciting! What kind of projects?',
            timestamp: new Date(Date.now() - 180000),
            type: 'text'
          }
        ]
      });

      setActiveChat(firstChatId);
    }
  }, [user]);

  const sendMessage = useCallback((chatId: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      content,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: newMessage }
        : chat
    ));
  }, [user]);

  const markAsRead = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0 }
        : chat
    ));
  }, []);

  return {
    chats,
    messages,
    activeChat,
    currentUser: user,
    setActiveChat,
    sendMessage,
    markAsRead
  };
};