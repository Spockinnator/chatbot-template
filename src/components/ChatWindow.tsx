// src/components/ChatWindow.tsx
// Main chat window

import { ChatHeader } from './ChatHeader.js';
import { MessageList } from './MessageList.js';
import { ChatInput } from './ChatInput.js';
import { ActionCard } from './ActionCard.js';
import { StatusIndicator } from './StatusIndicator.js';
import type { ChatMessage, AgentAction, ConnectionStatus } from '../types.js';

interface ChatWindowProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  connectionStatus: ConnectionStatus;
  pendingAction?: AgentAction;
  headerTitle: string;
  headerSubtitle?: string;
  placeholder: string;
  showPoweredBy: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onActionConfirm: (action: AgentAction) => void;
  onActionCancel: () => void;
}

/**
 * Chat window with header, messages, and input
 */
export function ChatWindow({
  messages,
  isProcessing,
  connectionStatus,
  pendingAction,
  headerTitle,
  headerSubtitle,
  placeholder,
  showPoweredBy,
  onClose,
  onSendMessage,
  onActionConfirm,
  onActionCancel
}: ChatWindowProps) {
  return (
    <div className="astermind-window">
      <ChatHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        onClose={onClose}
      >
        <StatusIndicator status={connectionStatus} />
      </ChatHeader>

      <div className="astermind-window__body">
        <MessageList messages={messages} isProcessing={isProcessing} />

        {pendingAction && (
          <ActionCard
            action={pendingAction}
            onConfirm={() => onActionConfirm(pendingAction)}
            onCancel={onActionCancel}
          />
        )}
      </div>

      <div className="astermind-window__footer">
        <ChatInput
          placeholder={placeholder}
          disabled={isProcessing || connectionStatus === 'error'}
          onSend={onSendMessage}
        />

        {showPoweredBy && (
          <div className="astermind-powered-by">
            Powered by <a href="https://astermind.ai" target="_blank" rel="noopener noreferrer">AsterMind</a>
          </div>
        )}
      </div>
    </div>
  );
}
