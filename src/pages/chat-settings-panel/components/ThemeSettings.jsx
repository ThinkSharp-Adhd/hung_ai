import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ThemeSettings = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [autoTheme, setAutoTheme] = useState(false);

  const themes = [
    {
      value: 'light',
      label: 'Light',
      icon: 'Sun',
      description: 'Clean and bright interface'
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: 'Moon',
      description: 'Easy on the eyes in low light'
    },
    {
      value: 'system',
      label: 'System',
      icon: 'Monitor',
      description: 'Follow system preference'
    }
  ];

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedAutoTheme = localStorage.getItem('autoTheme') === 'true';
    
    setCurrentTheme(savedTheme);
    setAutoTheme(savedAutoTheme);
    
    // Apply theme immediately
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme) => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  };

  const handleAutoThemeToggle = () => {
    const newValue = !autoTheme;
    setAutoTheme(newValue);
    localStorage.setItem('autoTheme', newValue.toString());
    
    if (newValue) {
      // Enable automatic theme switching based on time
      const hour = new Date().getHours();
      const autoTheme = (hour >= 18 || hour <= 6) ? 'dark' : 'light';
      handleThemeChange(autoTheme);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Icon name="Palette" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Appearance</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.value}
              variant={currentTheme === theme.value ? "default" : "outline"}
              onClick={() => handleThemeChange(theme.value)}
              className="justify-start h-auto p-4"
            >
              <div className="flex items-center space-x-3 w-full">
                <Icon name={theme.icon} size={20} />
                <div className="text-left flex-1">
                  <div className="font-medium">{theme.label}</div>
                  <div className="text-xs text-muted-foreground">{theme.description}</div>
                </div>
                {currentTheme === theme.value && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Auto Theme Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-primary" />
          <div>
            <span className="text-sm font-medium text-foreground">Auto Theme</span>
            <p className="text-xs text-muted-foreground">Switch theme based on time of day</p>
          </div>
        </div>
        <Button
          variant={autoTheme ? "default" : "outline"}
          size="sm"
          onClick={handleAutoThemeToggle}
          iconName={autoTheme ? "Check" : ""}
        >
          {autoTheme ? "On" : "Off"}
        </Button>
      </div>

      {/* Theme Preview */}
      <div className="p-4 bg-muted rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Eye" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Preview</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 bg-primary/10 rounded">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Bot" size={12} color="white" />
            </div>
            <span className="text-sm text-foreground">HUNG AI message preview</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-card rounded justify-end">
            <span className="text-sm text-foreground">Your message preview</span>
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={12} color="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;