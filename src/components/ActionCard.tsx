// src/components/ActionCard.tsx
// Agent action confirmation card

import type { AgentAction } from '../types.js';

interface ActionCardProps {
  action: AgentAction;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Action confirmation card for agentic capabilities
 */
export function ActionCard({ action, onConfirm, onCancel }: ActionCardProps) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'navigate':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15,3 21,3 21,9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        );
      case 'fillForm':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        );
      case 'clickElement':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 15l-2 5L9 9l11 4-5 2z" />
            <path d="M15 15l5 5" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        );
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'navigate': return 'Navigate to';
      case 'fillForm': return 'Fill form field';
      case 'clickElement': return 'Click';
      case 'triggerModal': return 'Open modal';
      case 'scroll': return 'Scroll to';
      case 'highlight': return 'Highlight';
      case 'custom': return 'Execute action';
      default: return 'Perform action';
    }
  };

  return (
    <div className="astermind-action-card">
      <div className="astermind-action-card__header">
        <div className="astermind-action-card__icon">
          {getActionIcon(action.type)}
        </div>
        <div className="astermind-action-card__title">
          <span className="astermind-action-card__label">{getActionLabel(action.type)}</span>
          <span className="astermind-action-card__target">{action.target}</span>
        </div>
      </div>

      {action.explanation && (
        <p className="astermind-action-card__explanation">{action.explanation}</p>
      )}

      <div className="astermind-action-card__confidence">
        <div
          className="astermind-action-card__confidence-bar"
          style={{ width: `${action.confidence * 100}%` }}
        />
        <span>{Math.round(action.confidence * 100)}% confident</span>
      </div>

      <div className="astermind-action-card__actions">
        <button
          className="astermind-action-card__cancel"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="astermind-action-card__confirm"
          onClick={onConfirm}
          type="button"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
