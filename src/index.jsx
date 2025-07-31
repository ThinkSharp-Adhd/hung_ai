import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

// Initialize theme and accessibility settings on app load
const initializeSettings = () => {
  // Load theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const themeToApply = savedTheme === 'system' ? systemTheme : savedTheme;
  
  document.documentElement.setAttribute('data-theme', themeToApply);

  // Load accessibility settings
  const savedFontSize = localStorage.getItem('fontSize') || 'default';
  const savedHighContrast = localStorage.getItem('highContrast') === 'true';
  const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';

  document.documentElement.setAttribute('data-font-size', savedFontSize);
  document.documentElement.setAttribute('data-high-contrast', savedHighContrast.toString());
  document.documentElement.setAttribute('data-reduce-motion', savedReduceMotion.toString());

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'system') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
};

// Initialize settings before rendering
initializeSettings();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);