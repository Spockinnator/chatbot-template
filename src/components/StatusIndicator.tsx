// src/components/StatusIndicator.tsx
// Online/offline status badge

import type { ConnectionStatus } from '../types.js';

interface StatusIndicatorProps {
  status: ConnectionStatus;
}

/**
 * Connection status indicator
 */
export function StatusIndicator({ status }: StatusIndicatorProps) {
  const getLabel = () => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`astermind-status astermind-status--${status}`}>
      <span className="astermind-status__dot" />
      <span className="astermind-status__label">{getLabel()}</span>
    </div>
  );
}
