import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useChat } from './hooks/useChat';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatWindow } from './components/ChatWindow';
import { LoginForm } from './components/LoginForm';

function ChatApp() {
  const { user, isLoading } = useAuth();
  const {
    chats,
    messages,
    activeChat,
    currentUser,
    setActiveChat,
    sendMessage,
    markAsRead
  } = useChat();

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const activeChatData = chats.find(chat => chat.id === activeChat) || null;
  const activeChatMessages = activeChat ? messages[activeChat] || [] : [];
  
  // Get all users from chats for message rendering
  const allUsers = React.useMemo(() => {
    if (!currentUser) return [];
    
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

  if (!currentUser) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

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

function App() {
  return (
    <AuthProvider>
      <ChatApp />
    </AuthProvider>
  );
}

export default App;