// src/components/MessageList.tsx
// Scrollable message container

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble.js';
import { TypingIndicator } from './TypingIndicator.js';
import type { ChatMessage } from '../types.js';

interface MessageListProps {
  messages: ChatMessage[];
  isProcessing: boolean;
}

/**
 * Scrollable message list with auto-scroll
 */
export function MessageList({ messages, isProcessing }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  return (
    <div className="astermind-messages" ref={listRef}>
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isProcessing && messages[messages.length - 1]?.content === '' && (
        <TypingIndicator />
      )}
    </div>
  );
}
