import React from 'react';
import { useChat } from './hooks/useChat';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatWindow } from './components/ChatWindow';

function App() {
  const {
    chats,
    messages,
    activeChat,
    currentUser,
    setActiveChat,
    sendMessage,
    markAsRead
  } = useChat();

  const activeChatData = chats.find(chat => chat.id === activeChat) || null;
  const activeChatMessages = activeChat ? messages[activeChat] || [] : [];
  
  // Get all users from chats for message rendering
  const allUsers = React.useMemo(() => {
    const users = [currentUser];
    chats.forEach(chat => {
      chat.participants.forEach(participant => {
        if (!users.find(u => u.id === participant.id)) {
          users.push(participant);
        }
      });
    });
    return users;
  }, [chats, currentUser]);

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleSendMessage = (content: string) => {
    if (activeChat) {
      sendMessage(activeChat, content);
    }
  };

  const handleMarkAsRead = () => {
    if (activeChat) {
      markAsRead(activeChat);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        currentUser={currentUser}
        onChatSelect={handleChatSelect}
      />
      <ChatWindow
        chat={activeChatData}
        messages={activeChatMessages}
        users={allUsers}
        currentUserId={currentUser.id}
        onSendMessage={handleSendMessage}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}

export default App;