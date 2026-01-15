// src/components/ChatbotWidget.tsx
// Main chatbot widget component

import { useState, useEffect, useCallback } from 'react';
import { ChatBubble } from './ChatBubble.js';
import { ChatWindow } from './ChatWindow.js';
import { ThemeProvider } from '../context/ThemeContext.js';
import type {
  AsterMindChatbotProps,
  ChatMessage,
  AgentAction,
  ConnectionStatus,
  OmegaResponse,
  Source
} from '../types.js';

/**
 * Simple HTTP client for API communication
 * This is a placeholder until @astermind/cybernetic-chatbot-client is available
 */
class SimpleCyberneticClient {
  private apiUrl: string;
  private apiKey: string;
  private status: ConnectionStatus = 'connecting';
  private onStatusChange?: (status: ConnectionStatus) => void;
  private onError?: (error: { message: string }) => void;

  constructor(config: {
    apiUrl: string;
    apiKey: string;
    fallback?: { enabled?: boolean; cacheOnConnect?: boolean };
    onStatusChange?: (status: ConnectionStatus) => void;
    onError?: (error: { message: string }) => void;
  }) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.onStatusChange = config.onStatusChange;
    this.onError = config.onError;

    // Check connection
    this.checkConnection();
  }

  private async checkConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/external/health`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey
        }
      });

      if (response.ok) {
        this.status = 'online';
      } else {
        this.status = 'offline';
      }
    } catch {
      this.status = 'offline';
    }

    this.onStatusChange?.(this.status);
  }

  async ask(message: string, options?: { sessionId?: string }): Promise<OmegaResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/api/external/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          message,
          sessionId: options?.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      return {
        reply: data.reply,
        sessionId: data.sessionId,
        sources: data.sources,
        confidence: 'high',
        offline: false
      };
    } catch (error) {
      this.onError?.({ message: (error as Error).message });
      throw error;
    }
  }

  async askStream(
    message: string,
    callbacks: {
      onToken?: (token: string) => void;
      onSources?: (sources: Source[]) => void;
      onComplete?: (response: OmegaResponse) => void;
      onError?: (error: { message: string }) => void;
    },
    options?: { sessionId?: string }
  ): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/external/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          message,
          sessionId: options?.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let sources: Source[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'chunk') {
                fullContent += data.content;
                callbacks.onToken?.(data.content);
              } else if (data.type === 'sources') {
                sources = data.sources;
                callbacks.onSources?.(data.sources);
              } else if (data.type === 'done') {
                callbacks.onComplete?.({
                  reply: fullContent,
                  sessionId: data.sessionId,
                  sources,
                  confidence: 'high',
                  offline: false
                });
              } else if (data.type === 'error') {
                callbacks.onError?.({ message: data.error });
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      callbacks.onError?.({ message: (error as Error).message });
    }
  }

  getStatus(): { connection: ConnectionStatus } {
    return { connection: this.status };
  }
}

/**
 * Main AsterMind Chatbot Widget
 *
 * Drop-in chatbot component with full functionality.
 */
export function ChatbotWidget(props: AsterMindChatbotProps) {
  const {
    apiKey,
    apiUrl = 'https://api.astermind.ai',
    position = 'bottom-right',
    theme = {},
    greeting = 'Hi! How can I help you today?',
    placeholder = 'Type your message...',
    fallback = { enabled: true },
    showPoweredBy = true,
    headerTitle = 'AsterMind',
    headerSubtitle = 'AI Assistant',
    defaultOpen = false,
    zIndex = 9999,
    onReady,
    onMessage,
    onAction,
    onError,
    onToggle
  } = props;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [client, setClient] = useState<SimpleCyberneticClient | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<AgentAction | undefined>();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // Initialize client
  useEffect(() => {
    const cyberneticClient = new SimpleCyberneticClient({
      apiUrl,
      apiKey,
      fallback: {
        enabled: fallback?.enabled ?? true,
        cacheOnConnect: true
      },
      onStatusChange: (status) => {
        setConnectionStatus(status);
      },
      onError: (error) => {
        onError?.(new Error(error.message));
      }
    });

    setClient(cyberneticClient);

    // Add greeting message
    if (greeting) {
      const greetingMsg: ChatMessage = {
        id: 'greeting',
        role: 'assistant',
        content: greeting,
        timestamp: new Date()
      };
      setMessages([greetingMsg]);
    }

    onReady?.();

    return () => {
      // Cleanup if needed
    };
  }, [apiKey, apiUrl, fallback?.enabled, greeting, onError, onReady]);

  // Handle toggle
  const handleToggle = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  }, [isOpen, onToggle]);

  // Handle close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    onToggle?.(false);
  }, [onToggle]);

  // Handle send message
  const handleSendMessage = useCallback(async (content: string) => {
    if (!client || !content.trim() || isProcessing) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    onMessage?.(userMessage);
    setIsProcessing(true);

    // Add placeholder for assistant response
    const assistantId = `assistant-${Date.now()}`;
    const placeholderMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    setMessages(prev => [...prev, placeholderMessage]);

    try {
      // Use streaming if available
      let fullContent = '';

      await client.askStream(content, {
        onToken: (token) => {
          fullContent += token;
          setMessages(prev => prev.map(msg =>
            msg.id === assistantId
              ? { ...msg, content: fullContent }
              : msg
          ));
        },
        onSources: (sources) => {
          setMessages(prev => prev.map(msg =>
            msg.id === assistantId
              ? { ...msg, sources }
              : msg
          ));
        },
        onComplete: (response) => {
          const finalMessage: ChatMessage = {
            id: assistantId,
            role: 'assistant',
            content: response.reply,
            timestamp: new Date(),
            sources: response.sources,
            confidence: response.confidence,
            offline: response.offline,
            isStreaming: false
          };

          setMessages(prev => prev.map(msg =>
            msg.id === assistantId ? finalMessage : msg
          ));

          setSessionId(response.sessionId);
          onMessage?.(finalMessage);
        },
        onError: () => {
          // Fallback to non-streaming on error
          handleNonStreamingResponse(client, content, assistantId);
        }
      }, { sessionId });
    } catch {
      // Handle error
      const errorMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        isStreaming: false
      };

      setMessages(prev => prev.map(msg =>
        msg.id === assistantId ? errorMessage : msg
      ));

      onError?.(new Error('Failed to process message'));
    } finally {
      setIsProcessing(false);
    }
  }, [client, isProcessing, sessionId, onMessage, onError]);

  // Non-streaming fallback
  const handleNonStreamingResponse = async (
    cyberneticClient: SimpleCyberneticClient,
    content: string,
    messageId: string
  ) => {
    try {
      const response = await cyberneticClient.ask(content, { sessionId });

      const finalMessage: ChatMessage = {
        id: messageId,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence,
        offline: response.offline,
        isStreaming: false
      };

      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? finalMessage : msg
      ));

      setSessionId(response.sessionId);
      onMessage?.(finalMessage);
    } catch {
      const errorMessage: ChatMessage = {
        id: messageId,
        role: 'assistant',
        content: 'I\'m having trouble connecting. Please try again later.',
        timestamp: new Date(),
        isStreaming: false
      };

      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? errorMessage : msg
      ));
    }
  };

  // Handle action confirmation
  const handleActionConfirm = useCallback(async (action: AgentAction) => {
    if (!pendingAction) return;

    const updatedAction: AgentAction = {
      ...pendingAction,
      status: 'executed',
      result: {
        success: true,
        message: `Action ${action.type} completed`
      }
    };

    setPendingAction(undefined);
    onAction?.(updatedAction);
  }, [pendingAction, onAction]);

  // Handle action cancel
  const handleActionCancel = useCallback(() => {
    if (!pendingAction) return;

    const cancelledAction: AgentAction = {
      ...pendingAction,
      status: 'cancelled'
    };

    setPendingAction(undefined);
    onAction?.(cancelledAction);
  }, [pendingAction, onAction]);

  return (
    <ThemeProvider theme={theme}>
      <div
        className={`astermind-chatbot astermind-chatbot--${position}`}
        style={{ zIndex }}
      >
        {!isOpen && (
          <ChatBubble onClick={handleToggle} position={position} />
        )}

        {isOpen && (
          <ChatWindow
            messages={messages}
            isProcessing={isProcessing}
            connectionStatus={connectionStatus}
            pendingAction={pendingAction}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            placeholder={placeholder}
            showPoweredBy={showPoweredBy}
            onClose={handleClose}
            onSendMessage={handleSendMessage}
            onActionConfirm={handleActionConfirm}
            onActionCancel={handleActionCancel}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

// Alias for convenience
export const AsterMindChatbot = ChatbotWidget;
