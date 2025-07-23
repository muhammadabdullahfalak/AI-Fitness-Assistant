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

  console.log('currentThread:', currentThread, 'chatStarted:', chatStarted);

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
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold">AI Fitness Assistant</h1>
              </div>
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
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation or start a new chat.
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;