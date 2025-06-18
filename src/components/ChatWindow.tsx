import React, { useEffect } from 'react';
import { Chat, Message, User } from '../types/chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  users: User[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onMarkAsRead: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  users,
  currentUserId,
  onSendMessage,
  onMarkAsRead
}) => {
  useEffect(() => {
    if (chat) {
      onMarkAsRead();
    }
  }, [chat, onMarkAsRead]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Chat</h3>
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader chat={chat} />
      <ChatMessages 
        messages={messages} 
        users={users} 
        currentUserId={currentUserId} 
      />
      <MessageInput 
        onSendMessage={onSendMessage}
      />
    </div>
  );
};