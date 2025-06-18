import React, { useEffect, useRef } from 'react';
import { Message, User } from '../types/chat';
import { MessageBubble } from './MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  users: User[];
  currentUserId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  users,
  currentUserId
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserById = (id: string): User | null => {
    return users.find(user => user.id === id) || null;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="space-y-1">
        {messages.map((message, index) => {
          const sender = getUserById(message.senderId);
          const isOwn = message.senderId === currentUserId;
          const prevMessage = messages[index - 1];
          const showAvatar = !prevMessage || 
            prevMessage.senderId !== message.senderId ||
            (message.timestamp.getTime() - prevMessage.timestamp.getTime()) > 300000; // 5 minutes

          return (
            <MessageBubble
              key={message.id}
              message={message}
              sender={sender}
              isOwn={isOwn}
              showAvatar={showAvatar}
            />
          );
        })}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};