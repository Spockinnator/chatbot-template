// Tests for ChatBubble component
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatBubble } from '../../components/ChatBubble.js';

describe('ChatBubble', () => {
  it('renders a button', () => {
    render(<ChatBubble onClick={() => {}} position="bottom-right" />);

    const button = screen.getByRole('button', { name: /open chat/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ChatBubble onClick={handleClick} position="bottom-right" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies position class', () => {
    render(<ChatBubble onClick={() => {}} position="bottom-left" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('astermind-bubble--bottom-left');
  });

  it('shows badge when unreadCount > 0', () => {
    render(<ChatBubble onClick={() => {}} position="bottom-right" unreadCount={3} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show badge when unreadCount is 0', () => {
    render(<ChatBubble onClick={() => {}} position="bottom-right" unreadCount={0} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders chat icon SVG', () => {
    render(<ChatBubble onClick={() => {}} position="bottom-right" />);

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
