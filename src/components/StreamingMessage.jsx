import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Icon from './AppIcon';

const StreamingMessage = ({ 
  content, 
  isStreaming = false, 
  streamingSpeed = 30,
  onStreamComplete 
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(content);
      return;
    }

    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, streamingSpeed);

      return () => clearTimeout(timer);
    } else if (currentIndex >= content.length && onStreamComplete) {
      onStreamComplete();
    }
  }, [content, currentIndex, isStreaming, streamingSpeed, onStreamComplete]);

  // Reset when content changes
  useEffect(() => {
    if (isStreaming) {
      setDisplayedContent('');
      setCurrentIndex(0);
    }
  }, [content, isStreaming]);

  // Custom markdown components for consistent styling
  const markdownComponents = {
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
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3 max-w-[80%] sm:max-w-[70%] lg:max-w-[60%]">
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="Bot" size={16} color="white" />
        </div>
        
        <div className="flex flex-col items-start">
          <div className="bg-card text-card-foreground border border-border message-bubble">
            <div className="text-sm leading-relaxed">
              <ReactMarkdown components={markdownComponents}>
                {displayedContent}
              </ReactMarkdown>
              {isStreaming && currentIndex < content.length && (
                <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingMessage;