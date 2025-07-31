import React, { useState, useCallback, useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import openaiService from '../../services/openaiService';
import useChatHistory from '../../hooks/useChatHistory';

const MainChatInterface = () => {
  const {
    messages,
    settings,
    addMessage,
    updateLastMessage,
    clearMessages,
    saveToHistory,
    updateSettings
  } = useChatHistory();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Stream message with smooth typing animation
  const streamMessageResponse = async (message, conversationHistory = []) => {
    try {
      setIsStreaming(true);
      let streamedContent = '';
      
      // Add placeholder AI message for streaming
      const aiMessage = addMessage({
        content: '',
        isUser: false,
        isStreaming: true
      });

      await openaiService.streamMessage(
        message, 
        conversationHistory,
        (chunk) => {
          streamedContent += chunk;
          updateLastMessage(streamedContent);
        }
      );

      // Mark streaming as complete
      setIsStreaming(false);
      updateLastMessage(streamedContent);
      
      return streamedContent;
    } catch (error) {
      setIsStreaming(false);
      throw error;
    }
  };

  // Fallback to regular API if streaming fails
  const sendMessageToAPI = async (message, conversationHistory = []) => {
    try {
      const response = await openaiService.sendMessage(message, conversationHistory);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSendMessage = useCallback(async (messageContent) => {
    if (!messageContent.trim() || isLoading) return;

    // Add user message
    addMessage({
      content: messageContent,
      isUser: true
    });

    setIsLoading(true);
    setError(null);

    try {
      // Get conversation history for context (last 10 messages for efficiency)
      const conversationHistory = messages.slice(-10);
      
      // Try streaming first, fallback to regular API
      let aiResponse;
      try {
        aiResponse = await streamMessageResponse(messageContent, conversationHistory);
      } catch (streamError) {
        console.warn('Streaming failed, falling back to regular API:', streamError);
        aiResponse = await sendMessageToAPI(messageContent, conversationHistory);
        
        // Add AI message if streaming failed
        addMessage({
          content: aiResponse,
          isUser: false
        });
      }

    } catch (err) {
      setError(err.message || 'Failed to get response from AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, addMessage, updateLastMessage]);

  const handleClearChat = useCallback(() => {
    if (messages.length > 0) {
      // Save current conversation to history before clearing
      saveToHistory();
    }
    clearMessages();
    setError(null);
  }, [messages, clearMessages, saveToHistory]);

  const handleCopyMessage = useCallback((content) => {
    navigator.clipboard.writeText(content).then(() => {
      // Could add a toast notification here
      console.log('Message copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy message:', err);
    });
  }, []);

  // Save conversation periodically and on unload
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (messages.length > 0) {
        // Auto-save every 30 seconds
        saveToHistory();
      }
    }, 30000);

    const handleBeforeUnload = () => {
      if (messages.length > 0) {
        saveToHistory();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages, saveToHistory]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ChatHeader />
      
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        error={error}
        onClearChat={handleClearChat}
        onCopyMessage={handleCopyMessage}
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || isStreaming}
        characterCount={0}
        maxCharacters={4000}
      />
    </div>
  );
};

export default MainChatInterface;