// Tests for useChat hook
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '../../hooks/useChat.js';
import type { ChatMessage, AgentAction } from '../../types.js';

describe('useChat', () => {
  const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
    id: `msg-${Date.now()}`,
    role: 'user',
    content: 'Test message',
    timestamp: new Date(),
    ...overrides
  });

  describe('initialization', () => {
    it('initializes with empty messages by default', () => {
      const { result } = renderHook(() => useChat());
      expect(result.current.messages).toEqual([]);
    });

    it('initializes with provided messages', () => {
      const initialMessages = [createMessage({ id: '1', content: 'Hello' })];
      const { result } = renderHook(() => useChat(initialMessages));
      expect(result.current.messages).toEqual(initialMessages);
    });

    it('initializes pendingAction as undefined', () => {
      const { result } = renderHook(() => useChat());
      expect(result.current.pendingAction).toBeUndefined();
    });
  });

  describe('addMessage', () => {
    it('adds a message to the list', () => {
      const { result } = renderHook(() => useChat());
      const message = createMessage({ id: '1', content: 'New message' });

      act(() => {
        result.current.addMessage(message);
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0]).toEqual(message);
    });

    it('appends messages in order', () => {
      const { result } = renderHook(() => useChat());
      const msg1 = createMessage({ id: '1', content: 'First' });
      const msg2 = createMessage({ id: '2', content: 'Second' });

      act(() => {
        result.current.addMessage(msg1);
      });
      act(() => {
        result.current.addMessage(msg2);
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].content).toBe('First');
      expect(result.current.messages[1].content).toBe('Second');
    });
  });

  describe('updateMessage', () => {
    it('updates an existing message by id', () => {
      const initialMessage = createMessage({ id: '1', content: 'Original' });
      const { result } = renderHook(() => useChat([initialMessage]));

      act(() => {
        result.current.updateMessage('1', { content: 'Updated' });
      });

      expect(result.current.messages[0].content).toBe('Updated');
      expect(result.current.messages[0].id).toBe('1');
    });

    it('does not affect other messages', () => {
      const msg1 = createMessage({ id: '1', content: 'First' });
      const msg2 = createMessage({ id: '2', content: 'Second' });
      const { result } = renderHook(() => useChat([msg1, msg2]));

      act(() => {
        result.current.updateMessage('1', { content: 'Updated' });
      });

      expect(result.current.messages[0].content).toBe('Updated');
      expect(result.current.messages[1].content).toBe('Second');
    });

    it('preserves other properties when updating', () => {
      const initialMessage = createMessage({
        id: '1',
        content: 'Original',
        role: 'assistant',
        sources: [{ title: 'Source', snippet: 'Text', relevance: 0.9 }]
      });
      const { result } = renderHook(() => useChat([initialMessage]));

      act(() => {
        result.current.updateMessage('1', { content: 'Updated' });
      });

      expect(result.current.messages[0].content).toBe('Updated');
      expect(result.current.messages[0].role).toBe('assistant');
      expect(result.current.messages[0].sources).toHaveLength(1);
    });

    it('does nothing if message id not found', () => {
      const msg = createMessage({ id: '1', content: 'Original' });
      const { result } = renderHook(() => useChat([msg]));

      act(() => {
        result.current.updateMessage('nonexistent', { content: 'Updated' });
      });

      expect(result.current.messages[0].content).toBe('Original');
    });
  });

  describe('clearMessages', () => {
    it('removes all messages', () => {
      const messages = [
        createMessage({ id: '1' }),
        createMessage({ id: '2' }),
        createMessage({ id: '3' })
      ];
      const { result } = renderHook(() => useChat(messages));

      act(() => {
        result.current.clearMessages();
      });

      expect(result.current.messages).toEqual([]);
    });
  });

  describe('setPendingAction', () => {
    it('sets pending action', () => {
      const { result } = renderHook(() => useChat());
      const action: AgentAction = {
        id: 'action-1',
        type: 'navigate',
        target: '/dashboard',
        confidence: 0.9,
        status: 'pending'
      };

      act(() => {
        result.current.setPendingAction(action);
      });

      expect(result.current.pendingAction).toEqual(action);
    });

    it('clears pending action when set to undefined', () => {
      const { result } = renderHook(() => useChat());
      const action: AgentAction = {
        id: 'action-1',
        type: 'navigate',
        target: '/dashboard',
        confidence: 0.9,
        status: 'pending'
      };

      act(() => {
        result.current.setPendingAction(action);
      });
      act(() => {
        result.current.setPendingAction(undefined);
      });

      expect(result.current.pendingAction).toBeUndefined();
    });
  });
});
