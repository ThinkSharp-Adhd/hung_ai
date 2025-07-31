/**
 * Local Storage utility functions for HUNG AI chat persistence
 */

const STORAGE_KEYS = {
  CHAT_HISTORY: 'hung_ai_chat_history',
  CHAT_SETTINGS: 'hung_ai_chat_settings',
  CURRENT_CONVERSATION: 'hung_ai_current_conversation'
};

export const localStorage = {
  // Chat History Management
  getChatHistory: () => {
    try {
      const history = window.localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading chat history from localStorage:', error);
      return [];
    }
  },

  saveChatHistory: (history) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history to localStorage:', error);
    }
  },

  // Current Conversation Management
  getCurrentConversation: () => {
    try {
      const conversation = window.localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
      return conversation ? JSON.parse(conversation) : null;
    } catch (error) {
      console.error('Error reading current conversation from localStorage:', error);
      return null;
    }
  },

  saveCurrentConversation: (messages) => {
    try {
      const conversation = {
        messages,
        lastUpdated: new Date().toISOString(),
        id: Date.now()
      };
      window.localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, JSON.stringify(conversation));
    } catch (error) {
      console.error('Error saving current conversation to localStorage:', error);
    }
  },

  clearCurrentConversation: () => {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
    } catch (error) {
      console.error('Error clearing current conversation from localStorage:', error);
    }
  },

  // Settings Management
  getSettings: () => {
    try {
      const settings = window.localStorage.getItem(STORAGE_KEYS.CHAT_SETTINGS);
      return settings ? JSON.parse(settings) : {
        startNewChatOnReopen: true,
        theme: 'light',
        fontSize: 'default',
        highContrast: false,
        reduceMotion: false
      };
    } catch (error) {
      console.error('Error reading settings from localStorage:', error);
      return {
        startNewChatOnReopen: true,
        theme: 'light',
        fontSize: 'default',
        highContrast: false,
        reduceMotion: false
      };
    }
  },

  saveSettings: (settings) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CHAT_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  },

  // Utility Functions
  clearAllData: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing all localStorage data:', error);
    }
  },

  getStorageUsage: () => {
    try {
      const totalSize = Object.values(STORAGE_KEYS).reduce((total, key) => {
        const item = window.localStorage.getItem(key);
        return total + (item ? item.length : 0);
      }, 0);
      return Math.round(totalSize / 1024); // Return size in KB
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }
};

export default localStorage;