import React from 'react';
import { Phone, Video, MoreHorizontal, Search } from 'lucide-react';
import { Chat, User } from '../types/chat';

interface ChatHeaderProps {
  chat: Chat | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  if (!chat) {
    return (
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  const participant = chat.type === 'direct' ? chat.participants[0] : null;
  const avatar = chat.avatar || participant?.avatar;
  const name = chat.name;
  const status = participant?.status;

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {chat.type === 'direct' && status === 'online' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          {chat.type === 'direct' && participant && (
            <p className="text-sm text-gray-500 capitalize">
              {status === 'online' ? 'Active now' : 
               status === 'away' ? 'Away' : 
               'Last seen recently'}
            </p>
          )}
          {chat.type === 'group' && (
            <p className="text-sm text-gray-500">
              {chat.participants.length} members
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Video className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};