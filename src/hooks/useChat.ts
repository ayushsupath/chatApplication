import { useState, useEffect, useCallback } from 'react';
import { User, Message, Chat } from '../types/chat';

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

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    type: 'direct',
    participants: [mockUsers[0]],
    lastMessage: {
      id: '1',
      senderId: '1',
      content: 'Hey! How are you doing today?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Design Team',
    type: 'group',
    participants: [mockUsers[1], mockUsers[2]],
    lastMessage: {
      id: '2',
      senderId: '2',
      content: 'The new mockups look great!',
      timestamp: new Date(Date.now() - 600000),
      type: 'text'
    },
    unreadCount: 0,
    avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Carol Davis',
    type: 'direct',
    participants: [mockUsers[2]],
    lastMessage: {
      id: '3',
      senderId: '3',
      content: 'Thanks for the help with the project!',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    unreadCount: 0
  }
];

const mockMessages: { [chatId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      senderId: '1',
      content: 'Hey! How are you doing today?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      senderId: 'current',
      content: 'I\'m doing great! Just working on some new projects.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      content: 'That sounds exciting! What kind of projects?',
      timestamp: new Date(Date.now() - 180000),
      type: 'text'
    }
  ],
  '2': [
    {
      id: '4',
      senderId: '2',
      content: 'The new mockups look great!',
      timestamp: new Date(Date.now() - 600000),
      type: 'text'
    },
    {
      id: '5',
      senderId: '3',
      content: 'I agree! The color scheme is perfect.',
      timestamp: new Date(Date.now() - 540000),
      type: 'text'
    }
  ],
  '3': [
    {
      id: '6',
      senderId: '3',
      content: 'Thanks for the help with the project!',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    {
      id: '7',
      senderId: 'current',
      content: 'You\'re welcome! Happy to help anytime.',
      timestamp: new Date(Date.now() - 1740000),
      type: 'text'
    }
  ]
};

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>(mockMessages);
  const [activeChat, setActiveChat] = useState<string | null>('1');
  const [currentUser] = useState<User>({
    id: 'current',
    name: 'You',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online'
  });

  const sendMessage = useCallback((chatId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current',
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
  }, []);

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
    currentUser,
    setActiveChat,
    sendMessage,
    markAsRead
  };
};