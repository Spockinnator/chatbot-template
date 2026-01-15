// src/components/ChatHeader.tsx
// Chat window header

import React from 'react';

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

/**
 * Chat window header with title and close button
 */
export function ChatHeader({ title, subtitle, onClose, children }: ChatHeaderProps) {
  return (
    <div className="astermind-header">
      <div className="astermind-header__info">
        <h3 className="astermind-header__title">{title}</h3>
        {subtitle && <p className="astermind-header__subtitle">{subtitle}</p>}
      </div>

      <div className="astermind-header__actions">
        {children}
        <button
          className="astermind-header__close"
          onClick={onClose}
          aria-label="Close chat"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
