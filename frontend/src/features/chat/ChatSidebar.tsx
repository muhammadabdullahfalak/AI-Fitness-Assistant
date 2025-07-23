// Chat sidebar component with chat history

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentThread, clearCurrentThread, deleteChatThread, startNewThread, saveChatThread, enterNewChatMode, exitNewChatMode } from '@/store/slices/chatSlice';
import { Link } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Trash2, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { AppDispatch } from '@/store';

export const ChatSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { threads, currentThread } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNewChat = () => {
    dispatch(enterNewChatMode());
  };

  const handleSelectThread = async (threadId: string) => {
    // Exit new chat mode if active
    dispatch(exitNewChatMode());

    // Save current chat if needed
    if (currentThread && currentThread.messages.length > 0 && user) {
      await dispatch(saveChatThread({ ...currentThread, user_id: user.id }));
    }

    // Set the selected thread as current
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      dispatch(setCurrentThread(thread));
    }
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteChatThread(threadId));
    toast({
      title: "Chat Deleted",
      description: "The conversation has been removed.",
    });
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const threadDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - threadDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return threadDate.toLocaleDateString();
  };

  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <Activity className="w-6 h-6 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">AI Fitness</span>
          </Link>
          
          <Button
            onClick={handleNewChat}
            className="w-full gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Recent Conversations
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {threads.length === 0 ? (
                <div className="p-4 text-center text-sidebar-foreground/60 text-sm">
                  No conversations yet. Start a new chat to begin!
                </div>
              ) : (
                threads.map((thread) => (
                  <SidebarMenuItem key={thread.id}>
                    <SidebarMenuButton
                      onClick={async () => await handleSelectThread(thread.id)}
                      className={`w-full justify-between group ${
                        currentThread?.id === thread.id 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                          : 'hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">
                            {thread.title}
                          </div>
                          <div className="text-xs text-sidebar-foreground/60">
                            {formatDate(thread.updatedAt)}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => handleDeleteThread(thread.id, e)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};