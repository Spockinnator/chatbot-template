// src/hooks/useOmega.ts
// CyberneticClient wrapper hook

import { useState, useEffect, useCallback, useRef } from 'react';
import type { OmegaConfig, OmegaResponse, ConnectionStatus, Source } from '../types.js';

interface UseOmegaOptions extends Omit<OmegaConfig, 'onStatusChange' | 'onError'> {}

interface UseOmegaReturn {
  /** Send a message and get a response */
  sendMessage: (message: string) => Promise<OmegaResponse>;
  /** Send a message with streaming */
  sendMessageStream: (
    message: string,
    onToken: (token: string) => void
  ) => Promise<OmegaResponse>;
  /** Current connection status */
  connectionStatus: ConnectionStatus;
  /** Whether a request is in progress */
  isProcessing: boolean;
  /** Last error if any */
  lastError: Error | null;
  /** Current session ID */
  sessionId: string | undefined;
  /** Clear the session */
  clearSession: () => void;
  /** Sync cache for offline use */
  syncCache: () => Promise<void>;
}

/**
 * Simple HTTP client for API communication
 */
class SimpleClient {
  private apiUrl: string;
  private apiKey: string;
  private status: ConnectionStatus = 'connecting';
  private onStatusChange?: (status: ConnectionStatus) => void;
  private onError?: (error: { message: string }) => void;

  constructor(config: OmegaConfig) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.onStatusChange = config.onStatusChange;
    this.onError = config.onError;
    this.checkConnection();
  }

  private async checkConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/external/health`, {
        method: 'GET',
        headers: { 'X-API-Key': this.apiKey }
      });
      this.status = response.ok ? 'online' : 'offline';
      if (!response.ok) {
        this.onError?.({ message: `Health check failed: ${response.status}` });
      }
    } catch (error) {
      this.status = 'offline';
      this.onError?.({ message: (error as Error).message });
    }
    this.onStatusChange?.(this.status);
  }

  async ask(message: string, options?: { sessionId?: string }): Promise<OmegaResponse> {
    const response = await fetch(`${this.apiUrl}/api/external/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify({ message, sessionId: options?.sessionId })
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    return {
      reply: data.reply,
      sessionId: data.sessionId,
      sources: data.sources,
      confidence: 'high',
      offline: false
    };
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
        body: JSON.stringify({ message, sessionId: options?.sessionId })
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

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

  getStatus(): ConnectionStatus {
    return this.status;
  }
}

/**
 * React hook for CyberneticClient
 */
export function useOmega(options: UseOmegaOptions): UseOmegaReturn {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>();

  const clientRef = useRef<SimpleClient | null>(null);

  // Initialize client
  useEffect(() => {
    clientRef.current = new SimpleClient({
      ...options,
      onStatusChange: setConnectionStatus,
      onError: (error) => setLastError(new Error(error.message))
    });

    return () => {
      clientRef.current = null;
    };
  }, [options.apiUrl, options.apiKey]);

  // Send message (non-streaming)
  const sendMessage = useCallback(async (message: string): Promise<OmegaResponse> => {
    if (!clientRef.current) {
      throw new Error('Client not initialized');
    }

    setIsProcessing(true);
    setLastError(null);

    try {
      const response = await clientRef.current.ask(message, { sessionId });
      setSessionId(response.sessionId);
      return response;
    } catch (error) {
      setLastError(error as Error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId]);

  // Send message (streaming)
  const sendMessageStream = useCallback(async (
    message: string,
    onToken: (token: string) => void
  ): Promise<OmegaResponse> => {
    if (!clientRef.current) {
      throw new Error('Client not initialized');
    }

    setIsProcessing(true);
    setLastError(null);

    return new Promise((resolve, reject) => {
      clientRef.current!.askStream(message, {
        onToken,
        onComplete: (response) => {
          setSessionId(response.sessionId);
          setIsProcessing(false);
          resolve(response);
        },
        onError: (error) => {
          setLastError(new Error(error.message));
          setIsProcessing(false);
          reject(error);
        }
      }, { sessionId });
    });
  }, [sessionId]);

  // Clear session
  const clearSession = useCallback(() => {
    setSessionId(undefined);
  }, []);

  // Sync cache (placeholder)
  const syncCache = useCallback(async () => {
    // Cache sync functionality would go here
  }, []);

  return {
    sendMessage,
    sendMessageStream,
    connectionStatus,
    isProcessing,
    lastError,
    sessionId,
    clearSession,
    syncCache
  };
}
