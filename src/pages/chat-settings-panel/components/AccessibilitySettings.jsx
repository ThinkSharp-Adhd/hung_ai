import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AccessibilitySettings = () => {
  const [fontSize, setFontSize] = useState('default');
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const fontSizes = [
    { value: 'small', label: 'Small', size: 'text-sm' },
    { value: 'default', label: 'Default', size: 'text-base' },
    { value: 'large', label: 'Large', size: 'text-lg' },
    { value: 'extra-large', label: 'Extra Large', size: 'text-xl' }
  ];

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedFontSize = localStorage.getItem('fontSize') || 'default';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';

    setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
    setReduceMotion(savedReduceMotion);

    // Apply settings immediately
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    document.documentElement.setAttribute('data-high-contrast', savedHighContrast.toString());
    document.documentElement.setAttribute('data-reduce-motion', savedReduceMotion.toString());
  }, []);

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
    // Apply font size to document root
    document.documentElement.setAttribute('data-font-size', newSize);
  };

  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', newValue.toString());
    // Apply high contrast mode
    document.documentElement.setAttribute('data-high-contrast', newValue.toString());
  };

  const handleReduceMotionToggle = () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    localStorage.setItem('reduceMotion', newValue.toString());
    // Apply reduced motion preference
    document.documentElement.setAttribute('data-reduce-motion', newValue.toString());
  };

  return (
    <div className="space-y-6">
      {/* Font Size Settings */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Icon name="Type" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Font Size</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fontSizes.map((size) => (
            <Button
              key={size.value}
              variant={fontSize === size.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFontSizeChange(size.value)}
              className="justify-center"
            >
              <span className={size.size}>{size.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* High Contrast Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Contrast" size={16} className="text-primary" />
          <div>
            <span className="text-sm font-medium text-foreground">High Contrast</span>
            <p className="text-xs text-muted-foreground">Increase color contrast for better visibility</p>
          </div>
        </div>
        <Button
          variant={highContrast ? "default" : "outline"}
          size="sm"
          onClick={handleHighContrastToggle}
          iconName={highContrast ? "Check" : ""}
        >
          {highContrast ? "On" : "Off"}
        </Button>
      </div>

      {/* Reduce Motion Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <div>
            <span className="text-sm font-medium text-foreground">Reduce Motion</span>
            <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
          </div>
        </div>
        <Button
          variant={reduceMotion ? "default" : "outline"}
          size="sm"
          onClick={handleReduceMotionToggle}
          iconName={reduceMotion ? "Check" : ""}
        >
          {reduceMotion ? "On" : "Off"}
        </Button>
      </div>

      {/* Preview Text */}
      <div className="p-4 bg-muted rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Eye" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Preview</span>
        </div>
        <p className={`${fontSizes.find(s => s.value === fontSize)?.size || 'text-base'} text-foreground`}>
          This is how your chat messages will appear with the current settings.
        </p>
      </div>
    </div>
  );
};

export default AccessibilitySettings;