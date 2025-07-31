import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Icon from '../../../components/AppIcon';

const MessageBubble = ({ message, isUser, timestamp, onCopy }) => {
  const [showActions, setShowActions] = useState(false);

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    onCopy?.();
  };

  // Custom markdown components for consistent styling
  const markdownComponents = {
    // Override default styling for markdown elements
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ inline, children }) => {
      if (inline) {
        return (
          <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return (
        <pre className="bg-muted p-3 rounded-lg mt-2 mb-2 overflow-x-auto">
          <code className="text-sm font-mono text-foreground">{children}</code>
        </pre>
      );
    },
    pre: ({ children }) => (
      <pre className="bg-muted p-3 rounded-lg mt-2 mb-2 overflow-x-auto">
        {children}
      </pre>
    ),
    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-sm">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground mb-2">
        {children}
      </blockquote>
    ),
    h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-semibold mb-2">{children}</h3>,
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {children}
      </a>
    ),
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex items-start space-x-3 max-w-[80%] sm:max-w-[70%] lg:max-w-[60%]`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bot" size={16} color="white" />
          </div>
        )}
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`message-bubble ${
              isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-card-foreground border border-border'
            }`}
          >
            <div className="text-sm leading-relaxed">
              {isUser ? (
                // For user messages, preserve line breaks but don't parse markdown
                <div className="whitespace-pre-wrap">{message}</div>
              ) : (
                // For AI messages, render markdown
                <ReactMarkdown components={markdownComponents}>
                  {message}
                </ReactMarkdown>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(timestamp)}
            </span>
            {showActions && (
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                title="Copy message"
              >
                <Icon name="Copy" size={12} />
              </button>
            )}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={16} color="white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;