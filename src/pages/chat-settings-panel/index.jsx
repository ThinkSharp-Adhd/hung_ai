import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import SettingsSection from './components/SettingsSection';
import UsageDisplay from './components/UsageDisplay';
import ConversationActions from './components/ConversationActions';
import AccessibilitySettings from './components/AccessibilitySettings';
import ThemeSettings from './components/ThemeSettings';

const ChatSettingsPanel = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'appearance', label: 'Appearance', icon: 'Palette' },
    { id: 'accessibility', label: 'Accessibility', icon: 'Eye' },
    { id: 'usage', label: 'Usage', icon: 'BarChart3' }
  ];

  useEffect(() => {
    // Animate panel entrance
    setIsVisible(true);
    
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/main-chat-interface');
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClearHistory = () => {
    // Mock clear history functionality
    console.log('Chat history cleared');
    // In real implementation, this would clear the chat state
  };

  const handleExportChat = async () => {
    // Mock export functionality
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Chat exported');
        // In real implementation, this would generate and download a file
        resolve();
      }, 1500);
    });
  };

  const handleCopyConversation = async () => {
    // Mock copy functionality
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Conversation copied to clipboard');
        // In real implementation, this would copy chat content to clipboard
        resolve();
      }, 1000);
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <SettingsSection title="Conversation Management">
              <ConversationActions
                onClearHistory={handleClearHistory}
                onExportChat={handleExportChat}
                onCopyConversation={handleCopyConversation}
              />
            </SettingsSection>
          </div>
        );

      case 'appearance':
        return (
          <SettingsSection title="Theme & Appearance">
            <ThemeSettings />
          </SettingsSection>
        );

      case 'accessibility':
        return (
          <SettingsSection title="Accessibility Options">
            <AccessibilitySettings />
          </SettingsSection>
        );

      case 'usage':
        return (
          <SettingsSection title="API Usage & Limits">
            <UsageDisplay />
          </SettingsSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile/Desktop Overlay */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/20 lg:bg-black/40" />
        
        {/* Settings Panel */}
        <div className={`absolute inset-0 lg:inset-y-0 lg:right-0 lg:w-96 bg-background border-l border-border lg:shadow-xl transition-transform duration-300 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Panel Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Settings" size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="hover:bg-muted"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>

          {/* Panel Footer */}
          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Bot" size={16} color="white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">HUNG AI</div>
                  <div className="text-xs text-muted-foreground">Always learning, always helping</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/main-chat-interface')}
                iconName="MessageCircle"
                iconPosition="left"
              >
                Back to Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingsPanel;