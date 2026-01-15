// src/hooks/useChat.ts
// Chat state management hook

import { useState, useCallback } from 'react';
import type { ChatMessage, AgentAction } from '../types.js';

interface UseChatReturn {
  /** All messages in the conversation */
  messages: ChatMessage[];
  /** Add a message */
  addMessage: (message: ChatMessage) => void;
  /** Update a message by ID */
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Pending action for confirmation */
  pendingAction: AgentAction | undefined;
  /** Set pending action */
  setPendingAction: (action: AgentAction | undefined) => void;
}

/**
 * Hook for managing chat state
 */
export function useChat(initialMessages: ChatMessage[] = []): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [pendingAction, setPendingAction] = useState<AgentAction | undefined>();

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    pendingAction,
    setPendingAction
  };
}
