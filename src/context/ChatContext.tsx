// src/context/ChatContext.tsx
// Chat state context provider

import React, { createContext, useContext, useState } from 'react';
import type { ChatState, ChatMessage, AgentAction, ConnectionStatus } from '../types.js';

interface ChatContextValue extends ChatState {
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setPendingAction: (action: AgentAction | undefined) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: React.ReactNode;
  initialMessages?: ChatMessage[];
}

/**
 * Chat state context provider
 */
export function ChatProvider({ children, initialMessages = [] }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus] = useState<ConnectionStatus>('connecting');
  const [sessionId] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<AgentAction | undefined>();

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value: ChatContextValue = {
    messages,
    isOpen,
    isProcessing,
    connectionStatus,
    sessionId,
    pendingAction,
    addMessage,
    updateMessage,
    clearMessages,
    setIsOpen,
    setIsProcessing,
    setPendingAction
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

/**
 * Use chat context
 */
export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
