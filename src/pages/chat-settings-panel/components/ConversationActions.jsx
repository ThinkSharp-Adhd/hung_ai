import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import useChatHistory from '../../../hooks/useChatHistory';

const ConversationActions = ({ 
  onClearHistory, 
  onExportChat, 
  onCopyConversation 
}) => {
  const { settings, updateSettings } = useChatHistory();
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExportChat?.();
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await onCopyConversation?.();
    } finally {
      setIsCopying(false);
    }
  };

  const handleNewChatSettingChange = (checked) => {
    updateSettings({ startNewChatOnReopen: checked });
  };

  return (
    <div className="space-y-6">
      {/* Chat Behavior Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Chat Behavior</h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="newChatOnReopen"
              checked={settings?.startNewChatOnReopen ?? true}
              onCheckedChange={handleNewChatSettingChange}
              className="mt-0.5"
            />
            <div className="flex-1">
              <label htmlFor="newChatOnReopen" className="text-sm font-medium text-foreground cursor-pointer">
                Start new chat when reopening
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                When enabled, a fresh conversation starts each time you open the app. 
                When disabled, you'll continue from where you left off.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Actions */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Actions</h4>
        
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={isCopying}
            iconName={isCopying ? "Loader2" : "Copy"}
            iconPosition="left"
            iconSize={14}
            className={isCopying ? "animate-spin" : ""}
          >
            {isCopying ? "Copying..." : "Copy Conversation"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            iconName={isExporting ? "Loader2" : "Download"}
            iconPosition="left"
            iconSize={14}
            className={isExporting ? "animate-spin" : ""}
          >
            {isExporting ? "Exporting..." : "Export Chat"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearHistory}
            iconName="Trash2"
            iconPosition="left"
            iconSize={14}
            className="text-error hover:text-error hover:border-error"
          >
            Clear History
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Export saves your conversation as a text file. Clear history removes all saved conversations permanently.
        </p>
      </div>
    </div>
  );
};

export default ConversationActions;