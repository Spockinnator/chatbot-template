// src/components/ChatInput.tsx
// Message input with send button

import React, { useState, useRef, KeyboardEvent } from 'react';

interface ChatInputProps {
  placeholder: string;
  disabled?: boolean;
  onSend: (message: string) => void;
}

/**
 * Chat input with send button
 */
export function ChatInput({ placeholder, disabled = false, onSend }: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setValue(textarea.value);

    // Reset height to auto to get proper scrollHeight
    textarea.style.height = 'auto';
    // Set to scrollHeight, max 120px
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="astermind-input">
      <textarea
        ref={inputRef}
        className="astermind-input__textarea"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label="Message input"
      />

      <button
        className="astermind-input__send"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </div>
  );
}
