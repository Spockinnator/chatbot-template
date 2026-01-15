// src/hooks/useTheme.ts
// Theme management hook

import { useMemo } from 'react';
import type { ChatbotTheme } from '../types.js';

const defaultTheme: Required<ChatbotTheme> = {
  primaryColor: '#4F46E5',
  primaryHover: '#4338CA',
  backgroundColor: '#ffffff',
  surfaceColor: '#f3f4f6',
  textColor: '#1f2937',
  textMuted: '#6b7280',
  borderColor: '#e5e7eb',
  userBubbleBackground: '#4F46E5',
  userBubbleText: '#ffffff',
  botBubbleBackground: '#f3f4f6',
  botBubbleText: '#1f2937',
  widgetWidth: '380px',
  widgetHeight: '520px',
  bubbleSize: '60px',
  borderRadius: '12px',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  fontSize: '14px',
  shadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
};

/**
 * Hook for theme management
 */
export function useTheme(theme?: ChatbotTheme) {
  const mergedTheme = useMemo(() => ({
    ...defaultTheme,
    ...theme
  }), [theme]);

  const cssVariables = useMemo(() => ({
    '--astermind-primary': mergedTheme.primaryColor,
    '--astermind-primary-hover': mergedTheme.primaryHover,
    '--astermind-background': mergedTheme.backgroundColor,
    '--astermind-surface': mergedTheme.surfaceColor,
    '--astermind-text': mergedTheme.textColor,
    '--astermind-text-muted': mergedTheme.textMuted,
    '--astermind-border': mergedTheme.borderColor,
    '--astermind-user-bg': mergedTheme.userBubbleBackground,
    '--astermind-user-text': mergedTheme.userBubbleText,
    '--astermind-bot-bg': mergedTheme.botBubbleBackground,
    '--astermind-bot-text': mergedTheme.botBubbleText,
    '--astermind-widget-width': mergedTheme.widgetWidth,
    '--astermind-widget-height': mergedTheme.widgetHeight,
    '--astermind-bubble-size': mergedTheme.bubbleSize,
    '--astermind-border-radius': mergedTheme.borderRadius,
    '--astermind-font-family': mergedTheme.fontFamily,
    '--astermind-font-size': mergedTheme.fontSize,
    '--astermind-shadow': mergedTheme.shadow
  }), [mergedTheme]);

  return {
    theme: mergedTheme,
    cssVariables
  };
}
