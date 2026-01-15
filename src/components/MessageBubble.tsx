// src/components/MessageBubble.tsx
// Individual message bubble

import { useState } from 'react';
import { SourceCitation } from './SourceCitation.js';
import type { ChatMessage } from '../types.js';
import { renderMarkdown } from '../utils/markdown.js';
import { formatTime } from '../utils/time.js';

interface MessageBubbleProps {
  message: ChatMessage;
}

/**
 * Individual message bubble with markdown support
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`astermind-message astermind-message--${message.role}`}>
      <div className="astermind-message__bubble">
        {message.isStreaming && !message.content ? (
          <span className="astermind-message__typing">
            <span></span>
            <span></span>
            <span></span>
          </span>
        ) : (
          <div
            className="astermind-message__content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        )}
      </div>

      <div className="astermind-message__meta">
        <span className="astermind-message__time">
          {formatTime(message.timestamp)}
        </span>

        {message.offline && (
          <span className="astermind-message__offline" title="Offline response">
            offline
          </span>
        )}

        {message.confidence && message.confidence !== 'high' && (
          <span
            className={`astermind-message__confidence astermind-message__confidence--${message.confidence}`}
            title={`Confidence: ${message.confidence}`}
          >
            {message.confidence}
          </span>
        )}
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="astermind-message__sources">
          <button
            className="astermind-message__sources-toggle"
            onClick={() => setShowSources(!showSources)}
            type="button"
          >
            {showSources ? 'Hide' : 'Show'} sources ({message.sources.length})
          </button>

          {showSources && (
            <SourceCitation sources={message.sources} />
          )}
        </div>
      )}
    </div>
  );
}
