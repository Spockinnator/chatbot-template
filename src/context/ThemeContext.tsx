// src/context/ThemeContext.tsx
// Theme context provider

import React, { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme.js';
import type { ChatbotTheme } from '../types.js';

interface ThemeContextValue {
  theme: Required<ChatbotTheme>;
  cssVariables: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  theme?: ChatbotTheme;
  children: React.ReactNode;
}

/**
 * Theme context provider
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const themeValue = useTheme(theme);

  return (
    <ThemeContext.Provider value={themeValue}>
      <div style={themeValue.cssVariables as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * Use theme context
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
