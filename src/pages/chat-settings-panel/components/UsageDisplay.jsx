import React from 'react';
import Icon from '../../../components/AppIcon';

const UsageDisplay = () => {
  const usageData = {
    tokensUsed: 15420,
    tokensLimit: 50000,
    requestsToday: 47,
    requestsLimit: 100,
    lastReset: "2025-07-30T00:00:00Z"
  };

  const tokenPercentage = (usageData.tokensUsed / usageData.tokensLimit) * 100;
  const requestPercentage = (usageData.requestsToday / usageData.requestsLimit) * 100;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Token Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Tokens Used</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {usageData.tokensUsed.toLocaleString()} / {usageData.tokensLimit.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {(100 - tokenPercentage).toFixed(1)}% remaining
        </p>
      </div>

      {/* Request Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="MessageSquare" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Requests Today</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {usageData.requestsToday} / {usageData.requestsLimit}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(requestPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Resets at midnight ({formatDate(usageData.lastReset)})
        </p>
      </div>

      {/* API Status */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm font-medium text-foreground">API Status</span>
        </div>
        <span className="text-sm text-success font-medium">Connected</span>
      </div>
    </div>
  );
};

export default UsageDisplay;