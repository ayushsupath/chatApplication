import React from 'react';
import { Message, User } from '../types/chat';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  sender: User | null;
  isOwn: boolean;
  showAvatar: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  isOwn,
  showAvatar
}) => {
  return (
    <div className={`flex items-end space-x-2 mb-4 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {showAvatar && !isOwn && (
        <img
          src={sender?.avatar}
          alt={sender?.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
      {!showAvatar && !isOwn && <div className="w-8" />}
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-auto' : ''}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        
        <div className={`mt-1 flex items-center space-x-1 text-xs text-gray-500 ${
          isOwn ? 'justify-end' : ''
        }`}>
          {!isOwn && showAvatar && (
            <span className="font-medium">{sender?.name}</span>
          )}
          <span>{format(message.timestamp, 'HH:mm')}</span>
          {message.edited && <span>• edited</span>}
        </div>
      </div>
    </div>
  );
};