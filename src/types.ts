// src/types.ts
// Type definitions for Chatbot Template

/**
 * Connection status for the chatbot
 */
export type ConnectionStatus = 'online' | 'offline' | 'connecting' | 'error';

/**
 * Confidence level for responses
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'none';

/**
 * Source document reference
 */
export interface Source {
  title: string;
  snippet: string;
  relevance: number;
  documentId?: string;
  sourceType?: string;
}

/**
 * Response from the Omega client
 */
export interface OmegaResponse {
  reply: string;
  sessionId: string;
  sources?: Source[];
  confidence?: ConfidenceLevel;
  offline?: boolean;
}

/**
 * Configuration for the Omega client
 */
export interface OmegaConfig {
  apiUrl: string;
  apiKey: string;
  fallback?: {
    enabled?: boolean;
    cacheOnConnect?: boolean;
  };
  onStatusChange?: (status: ConnectionStatus) => void;
  onError?: (error: { message: string }) => void;
}

/**
 * Theme configuration
 */
export interface ChatbotTheme {
  /** Primary brand color */
  primaryColor?: string;
  /** Primary color on hover */
  primaryHover?: string;
  /** Background color */
  backgroundColor?: string;
  /** Surface/card background */
  surfaceColor?: string;
  /** Primary text color */
  textColor?: string;
  /** Muted/secondary text */
  textMuted?: string;
  /** Border color */
  borderColor?: string;
  /** User message background */
  userBubbleBackground?: string;
  /** User message text */
  userBubbleText?: string;
  /** Bot message background */
  botBubbleBackground?: string;
  /** Bot message text */
  botBubbleText?: string;
  /** Widget width */
  widgetWidth?: string;
  /** Widget height */
  widgetHeight?: string;
  /** Trigger bubble size */
  bubbleSize?: string;
  /** Border radius */
  borderRadius?: string;
  /** Font family */
  fontFamily?: string;
  /** Base font size */
  fontSize?: string;
  /** Box shadow */
  shadow?: string;
}

/**
 * Position for the widget
 */
export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

/**
 * Agent configuration for agentic capabilities
 */
export interface AgentConfig {
  /** Enable agentic capabilities */
  enabled?: boolean;
  /** Confidence threshold for actions (0-1) */
  confidenceThreshold?: number;
  /** Site map for navigation */
  siteMap?: SiteMapEntry[];
  /** Custom action callbacks */
  customActions?: Record<string, (params: unknown) => Promise<void>>;
}

/**
 * Site map entry for navigation
 */
export interface SiteMapEntry {
  path: string;
  name: string;
  description?: string;
  params?: Record<string, string[]>;
  dynamicParams?: boolean;
}

/**
 * Fallback configuration
 */
export interface FallbackConfig {
  /** Enable offline fallback */
  enabled?: boolean;
  /** Message to show when offline */
  message?: string;
}

/**
 * Main chatbot widget props
 */
export interface AsterMindChatbotProps {
  /** API key for authentication */
  apiKey: string;
  /** Backend API URL (optional, has default) */
  apiUrl?: string;
  /** Widget position */
  position?: WidgetPosition;
  /** Theme customization */
  theme?: ChatbotTheme;
  /** Initial greeting message */
  greeting?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Agent configuration */
  agent?: AgentConfig;
  /** Fallback configuration */
  fallback?: FallbackConfig;
  /** Show powered by badge */
  showPoweredBy?: boolean;
  /** Custom header title */
  headerTitle?: string;
  /** Custom header subtitle */
  headerSubtitle?: string;
  /** Initial open state */
  defaultOpen?: boolean;
  /** Z-index for widget */
  zIndex?: number;

  // Event callbacks
  /** Called when widget is ready */
  onReady?: () => void;
  /** Called when a message is sent/received */
  onMessage?: (message: ChatMessage) => void;
  /** Called when an agentic action occurs */
  onAction?: (action: AgentAction) => void;
  /** Called when an error occurs */
  onError?: (error: Error) => void;
  /** Called when widget opens/closes */
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  confidence?: ConfidenceLevel;
  offline?: boolean;
  isStreaming?: boolean;
}

/**
 * Agent action
 */
export interface AgentAction {
  id: string;
  type: 'navigate' | 'fillForm' | 'clickElement' | 'triggerModal' | 'scroll' | 'highlight' | 'custom';
  target: string;
  params?: Record<string, unknown>;
  confidence: number;
  explanation?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'executed' | 'failed';
  result?: {
    success: boolean;
    message: string;
    error?: string;
  };
}

/**
 * Chat state
 */
export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isProcessing: boolean;
  connectionStatus: ConnectionStatus;
  sessionId?: string;
  pendingAction?: AgentAction;
}

/**
 * Vanilla JS initialization config
 */
export interface VanillaInitConfig extends Omit<AsterMindChatbotProps, 'theme'> {
  /** Theme as plain object (not React-style) */
  theme?: ChatbotTheme;
  /** Container element or selector (default: body) */
  container?: HTMLElement | string;
}

/**
 * Streaming callbacks for the client
 */
export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onSources?: (sources: Source[]) => void;
  onComplete?: (response: OmegaResponse) => void;
  onError?: (error: { message: string }) => void;
}

/**
 * Options for sending a message
 */
export interface SendOptions {
  sessionId?: string;
}
