// Main dashboard page with chat interface

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFitnessChat } from '@/hooks/useFitnessChat';
import { ChatSidebar } from '@/features/chat/ChatSidebar';
import { ChatInterface } from '@/features/chat/ChatInterface';
import { ProfileSetup } from '@/features/chat/ProfileSetup';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatHistory } from '@/store/slices/chatSlice';
import { RootState } from '@/store';
import type { AppDispatch } from '@/store';
import { Link } from 'react-router-dom';

export const useAppDispatch: () => AppDispatch = useDispatch;

const Chat = () => {
  const { user, logout } = useAuth();
  const { chatStarted, userProfile, currentThread } = useFitnessChat();
  const newChatMode = useSelector((state: RootState) => state.chat.newChatMode);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);


  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchChatHistory(currentUser.id));
    }
  }, [currentUser, dispatch]);


  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  ('currentThread:', currentThread, 'chatStarted:', chatStarted);

  return (
    <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen w-full flex bg-background">
        {/* Sidebar */}
        <ChatSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Activity className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold">AI Fitness Assistant</h1>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome back, {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </header>
          
          {/* Main Chat Area */}
          <div className="flex-1 overflow-hidden">
            {newChatMode ? (
              <ProfileSetup />
            ) : currentThread ? (
              <ChatInterface />
            ) : (
              <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
                <div className="max-w-md w-full mx-auto text-center">
                  <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10 0V6a4 4 0 00-8 0v2m8 0H7" />
                    </svg>
                  </div>
                  <div className="bg-card/80 rounded-xl shadow p-8">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Welcome to AI Fitness Chat</h2>
                    <p className="text-muted-foreground text-lg">Select a conversation or start a new chat to begin your fitness journey.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;