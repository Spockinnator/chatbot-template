// src/index.ts
// Main package exports

// Components
export { ChatbotWidget } from './components/ChatbotWidget.js';
export { AsterMindChatbot } from './components/ChatbotWidget.js';  // Alias
export { ChatBubble } from './components/ChatBubble.js';
export { ChatWindow } from './components/ChatWindow.js';
export { ChatHeader } from './components/ChatHeader.js';
export { ChatInput } from './components/ChatInput.js';
export { MessageBubble } from './components/MessageBubble.js';
export { MessageList } from './components/MessageList.js';
export { ActionCard } from './components/ActionCard.js';
export { SourceCitation } from './components/SourceCitation.js';
export { StatusIndicator } from './components/StatusIndicator.js';
export { TypingIndicator } from './components/TypingIndicator.js';

// Hooks
export { useOmega } from './hooks/useOmega.js';
export { useChat } from './hooks/useChat.js';
export { useTheme } from './hooks/useTheme.js';
export { useScrollToBottom } from './hooks/useScrollToBottom.js';

// Context
export { ChatProvider, useChatContext } from './context/ChatContext.js';
export { ThemeProvider, useThemeContext } from './context/ThemeContext.js';

// Types
export type {
  AsterMindChatbotProps,
  ChatbotTheme,
  ChatMessage,
  AgentAction,
  ChatState,
  WidgetPosition,
  AgentConfig,
  FallbackConfig,
  SiteMapEntry,
  VanillaInitConfig,
  OmegaResponse,
  OmegaConfig,
  Source,
  ConnectionStatus,
  ConfidenceLevel
} from './types.js';
