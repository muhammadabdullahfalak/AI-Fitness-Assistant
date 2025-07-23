// Individual chat message component

import { ChatMessage as ChatMessageType } from '@/constants/types';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageText = (text: string) => {
    // Simple markdown-like formatting
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        // Bold text
        return (
          <div key={index} className="font-semibold">
            {line.slice(2, -2)}
          </div>
        );
      }
      if (line.startsWith('- ')) {
        // Bullet point
        return (
          <div key={index} className="ml-4">
            • {line.slice(2)}
          </div>
        );
      }
      if (line.trim() === '') {
        // Empty line
        return <br key={index} />;
      }
      return <div key={index}>{line}</div>;
    });
  };

  return (
    <div className={cn(
      "flex items-start gap-3 chat-message-enter",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-chat-user" : "bg-primary"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-primary-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[70%]",
        isUser && "flex flex-col items-end"
      )}>
        <Card className={cn(
          "shadow-sm",
          isUser ? "bg-chat-user text-white" : "bg-chat-ai"
        )}>
          <CardContent className="p-4">
            <div className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap",
              isUser ? "text-foreground" : "text-foreground"
            )}>
              {isAI ? formatMessageText(message.text) : message.text}
            </div>
          </CardContent>
        </Card>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs text-muted-foreground mt-1 px-1",
          isUser && "text-right"
        )}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};