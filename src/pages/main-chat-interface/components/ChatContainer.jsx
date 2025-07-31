import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import StreamingMessage from '../../../components/StreamingMessage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChatContainer = ({ 
  messages, 
  isLoading, 
  isStreaming,
  onClearChat, 
  onCopyMessage,
  error 
}) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isStreaming]);

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages? This conversation will be saved to your history.')) {
      onClearChat();
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-16 pb-24">
      {/* Chat Header Actions */}
      {messages.length > 0 && (
        <div className="flex justify-end p-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            iconName="Trash2"
            iconPosition="left"
            iconSize={14}
          >
            Clear Chat
          </Button>
        </div>
      )}

      {/* Messages Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
              <Icon name="Bot" size={32} color="white" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Welcome to HUNG AI
            </h2>
            <p className="text-muted-foreground mb-6">
              Start a conversation with your AI assistant. Ask questions, get help with tasks, or just chat!
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              <div className="p-4 bg-muted rounded-lg text-left">
                <p className="text-sm text-foreground font-medium mb-1">💡 Try asking:</p>
                <p className="text-sm text-muted-foreground">"Help me write a professional email"</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-left">
                <p className="text-sm text-foreground font-medium mb-1">🔧 Or request:</p>
                <p className="text-sm text-muted-foreground">"Explain quantum computing in simple terms"</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-left">
                <p className="text-sm text-foreground font-medium mb-1">💻 Code help:</p>
                <p className="text-sm text-muted-foreground">"Write a Python function to sort a list"</p>
              </div>
            </div>
          </div>
        ) : (
          // Messages List
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => {
              // Show streaming message for the last AI message that's currently streaming
              if (!msg.isUser && msg.isStreaming && index === messages.length - 1 && isStreaming) {
                return (
                  <StreamingMessage
                    key={msg.id || index}
                    content={msg.content}
                    isStreaming={true}
                    streamingSpeed={25}
                  />
                );
              }
              
              return (
                <MessageBubble
                  key={msg.id || index}
                  message={msg.content}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                  onCopy={() => onCopyMessage?.(msg.content)}
                />
              );
            })}
            
            {(isLoading && !isStreaming) && <TypingIndicator />}
            
            {error && (
              <div className="flex justify-center mb-4">
                <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg max-w-md">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} />
                    <span className="text-sm font-medium">Error</span>
                  </div>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;