// Main chat interface component

import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useFitnessChat } from '@/hooks/useFitnessChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

export const ChatInterface = () => {
  const { currentThread } = useSelector((state: RootState) => state.chat);
  const { sendMessage, chatState } = useFitnessChat();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentThread?.messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || chatState.isLoading) return;

    const message = input.trim();
    setInput('');
    
    // Focus back to input
    inputRef.current?.focus();
    
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentThread) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Bot className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold text-muted-foreground">
            No conversation selected
          </h2>
          <p className="text-muted-foreground">
            Start a new chat or select an existing conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-full px-4 py-6"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {currentThread.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Loading indicator */}
            {chatState.isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <Card className="flex-1 bg-chat-ai">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="typing-indicator">AI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about fitness, nutrition, workouts..."
                disabled={chatState.isLoading}
                className="resize-none"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || chatState.isLoading}
              className="gradient-primary hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};