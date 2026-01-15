// Tests for useTheme hook
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from '../../hooks/useTheme.js';

describe('useTheme', () => {
  describe('default theme', () => {
    it('provides default theme values', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme.primaryColor).toBe('#4F46E5');
      expect(result.current.theme.primaryHover).toBe('#4338CA');
      expect(result.current.theme.backgroundColor).toBe('#ffffff');
      expect(result.current.theme.surfaceColor).toBe('#f3f4f6');
      expect(result.current.theme.textColor).toBe('#1f2937');
      expect(result.current.theme.borderRadius).toBe('12px');
    });

    it('provides all required theme properties', () => {
      const { result } = renderHook(() => useTheme());

      const requiredKeys = [
        'primaryColor',
        'primaryHover',
        'backgroundColor',
        'surfaceColor',
        'textColor',
        'textMuted',
        'borderColor',
        'userBubbleBackground',
        'userBubbleText',
        'botBubbleBackground',
        'botBubbleText',
        'widgetWidth',
        'widgetHeight',
        'bubbleSize',
        'borderRadius',
        'fontFamily',
        'fontSize',
        'shadow'
      ];

      requiredKeys.forEach(key => {
        expect(result.current.theme).toHaveProperty(key);
        expect(result.current.theme[key as keyof typeof result.current.theme]).toBeDefined();
      });
    });
  });

  describe('custom theme', () => {
    it('overrides default values with custom theme', () => {
      const customTheme = {
        primaryColor: '#10B981',
        borderRadius: '16px'
      };

      const { result } = renderHook(() => useTheme(customTheme));

      expect(result.current.theme.primaryColor).toBe('#10B981');
      expect(result.current.theme.borderRadius).toBe('16px');
    });

    it('preserves default values not specified in custom theme', () => {
      const customTheme = {
        primaryColor: '#10B981'
      };

      const { result } = renderHook(() => useTheme(customTheme));

      expect(result.current.theme.primaryColor).toBe('#10B981');
      expect(result.current.theme.primaryHover).toBe('#4338CA'); // default
      expect(result.current.theme.backgroundColor).toBe('#ffffff'); // default
    });
  });

  describe('CSS variables', () => {
    it('generates CSS variables from theme', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.cssVariables['--astermind-primary']).toBe('#4F46E5');
      expect(result.current.cssVariables['--astermind-primary-hover']).toBe('#4338CA');
      expect(result.current.cssVariables['--astermind-background']).toBe('#ffffff');
      expect(result.current.cssVariables['--astermind-text']).toBe('#1f2937');
    });

    it('generates all expected CSS variable keys', () => {
      const { result } = renderHook(() => useTheme());

      const expectedKeys = [
        '--astermind-primary',
        '--astermind-primary-hover',
        '--astermind-background',
        '--astermind-surface',
        '--astermind-text',
        '--astermind-text-muted',
        '--astermind-border',
        '--astermind-user-bg',
        '--astermind-user-text',
        '--astermind-bot-bg',
        '--astermind-bot-text',
        '--astermind-widget-width',
        '--astermind-widget-height',
        '--astermind-bubble-size',
        '--astermind-border-radius',
        '--astermind-font-family',
        '--astermind-font-size',
        '--astermind-shadow'
      ];

      expectedKeys.forEach(key => {
        expect(result.current.cssVariables).toHaveProperty(key);
      });
    });

    it('reflects custom theme in CSS variables', () => {
      const customTheme = {
        primaryColor: '#10B981',
        borderRadius: '20px'
      };

      const { result } = renderHook(() => useTheme(customTheme));

      expect(result.current.cssVariables['--astermind-primary']).toBe('#10B981');
      expect(result.current.cssVariables['--astermind-border-radius']).toBe('20px');
    });
  });

  describe('memoization', () => {
    it('returns same reference for same theme', () => {
      const customTheme = { primaryColor: '#10B981' };
      const { result, rerender } = renderHook(() => useTheme(customTheme));

      const firstTheme = result.current.theme;
      const firstCssVariables = result.current.cssVariables;

      rerender();

      expect(result.current.theme).toBe(firstTheme);
      expect(result.current.cssVariables).toBe(firstCssVariables);
    });
  });
});
