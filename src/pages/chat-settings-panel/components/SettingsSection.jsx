import React from 'react';

const SettingsSection = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;