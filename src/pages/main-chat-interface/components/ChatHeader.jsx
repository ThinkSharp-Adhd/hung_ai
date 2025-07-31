import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const ChatHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border surface-elevated">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
            <Icon name="Bot" size={24} color="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">HUNG AI</h1>
            <p className="text-xs text-muted-foreground">made by Lord UTK the Packer</p>
          </div>
        </div>

        {/* Settings Button */}
        <Link
          to="/chat-settings-panel"
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
        >
          <Icon name="Settings" size={20} color="currentColor" />
        </Link>
      </div>
    </header>
  );
};

export default ChatHeader;