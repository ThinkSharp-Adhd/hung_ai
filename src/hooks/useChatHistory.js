import { useState, useEffect, useCallback } from 'react';
import localStorage from '../utils/localStorage';

/**
 * Custom hook for managing chat history and persistence
 */
export const useChatHistory = () => {
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(localStorage.getSettings());

  // Load initial conversation on mount
  useEffect(() => {
    const loadInitialConversation = () => {
      if (settings.startNewChatOnReopen) {
        // Start with a fresh chat
        setMessages([]);
        localStorage.clearCurrentConversation();
      } else {
        // Load the last conversation
        const savedConversation = localStorage.getCurrentConversation();
        if (savedConversation?.messages) {
          setMessages(savedConversation.messages);
        }
      }
    };

    loadInitialConversation();
  }, [settings.startNewChatOnReopen]);

  // Save conversation whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.saveCurrentConversation(messages);
    }
  }, [messages]);

  // Add a new message
  const addMessage = useCallback((message) => {
    const newMessage = {
      ...message,
      id: Date.now() + Math.random(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Update the last message (useful for streaming)
  const updateLastMessage = useCallback((content) => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content
        };
      }
      return updated;
    });
  }, []);

  // Clear current conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.clearCurrentConversation();
  }, []);

  // Save conversation to history
  const saveToHistory = useCallback(() => {
    if (messages.length === 0) return;

    const history = localStorage.getChatHistory();
    const conversation = {
      id: Date.now(),
      title: messages[0]?.content?.substring(0, 50) + '...' || 'New Conversation',
      messages: messages,
      createdAt: new Date().toISOString(),
      messageCount: messages.length
    };

    history.unshift(conversation);
    // Keep only the last 50 conversations
    const trimmedHistory = history.slice(0, 50);
    localStorage.saveChatHistory(trimmedHistory);
  }, [messages]);

  // Load a conversation from history
  const loadConversation = useCallback((conversationId) => {
    const history = localStorage.getChatHistory();
    const conversation = history.find(conv => conv.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
    }
  }, []);

  // Get chat history
  const getChatHistory = useCallback(() => {
    return localStorage.getChatHistory();
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.saveSettings(updatedSettings);
  }, [settings]);

  return {
    messages,
    settings,
    addMessage,
    updateLastMessage,
    clearMessages,
    saveToHistory,
    loadConversation,
    getChatHistory,
    updateSettings
  };
};

export default useChatHistory;