import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInput = ({ onSendMessage, disabled, characterCount = 0, maxCharacters = 4000 }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setMessage(value);
      
      // Auto-resize textarea
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      }
    }
  };

  const isNearLimit = message.length > maxCharacters * 0.8;
  const isAtLimit = message.length >= maxCharacters;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={disabled ? "Please wait..." : "Type your message here..."}
              disabled={disabled}
              className={`w-full min-h-[44px] max-h-[120px] px-4 py-3 pr-16 bg-input border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              rows={1}
            />
            
            {/* Character count */}
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              <span className={isNearLimit ? (isAtLimit ? 'text-error' : 'text-warning') : ''}>
                {message.length}
              </span>
              <span className="text-muted-foreground">/{maxCharacters}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!message.trim() || disabled || isAtLimit}
            size="icon"
            className="h-11 w-11 flex-shrink-0"
            iconName="Send"
            iconSize={18}
          >
            <span className="sr-only">Send message</span>
          </Button>
        </form>

        {/* Rate limiting or error messages */}
        {disabled && (
          <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} className="mr-1" />
            <span>AI is processing your request...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;