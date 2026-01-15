// Tests for ChatInput component
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '../../components/ChatInput.js';

describe('ChatInput', () => {
  it('renders textarea with placeholder', () => {
    render(<ChatInput placeholder="Type here..." onSend={() => {}} />);

    const textarea = screen.getByPlaceholderText('Type here...');
    expect(textarea).toBeInTheDocument();
  });

  it('renders send button', () => {
    render(<ChatInput placeholder="Type..." onSend={() => {}} />);

    const button = screen.getByRole('button', { name: /send/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onSend with trimmed value when send button clicked', () => {
    const handleSend = vi.fn();
    render(<ChatInput placeholder="Type..." onSend={handleSend} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '  Hello world  ' } });

    const button = screen.getByRole('button', { name: /send/i });
    fireEvent.click(button);

    expect(handleSend).toHaveBeenCalledWith('Hello world');
  });

  it('calls onSend when Enter pressed without Shift', () => {
    const handleSend = vi.fn();
    render(<ChatInput placeholder="Type..." onSend={handleSend} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(handleSend).toHaveBeenCalledWith('Test message');
  });

  it('does not call onSend when Shift+Enter pressed', () => {
    const handleSend = vi.fn();
    render(<ChatInput placeholder="Type..." onSend={handleSend} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('clears input after sending', () => {
    const handleSend = vi.fn();
    render(<ChatInput placeholder="Type..." onSend={handleSend} />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    const button = screen.getByRole('button', { name: /send/i });
    fireEvent.click(button);

    expect(textarea.value).toBe('');
  });

  it('does not send empty messages', () => {
    const handleSend = vi.fn();
    render(<ChatInput placeholder="Type..." onSend={handleSend} />);

    const button = screen.getByRole('button', { name: /send/i });
    fireEvent.click(button);

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('does not send whitespace-only messages', () => {
    const handleSend = vi.fn();
    render(<ChatInput placeholder="Type..." onSend={handleSend} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '   ' } });

    const button = screen.getByRole('button', { name: /send/i });
    fireEvent.click(button);

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('disables textarea and button when disabled prop is true', () => {
    render(<ChatInput placeholder="Type..." onSend={() => {}} disabled />);

    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /send/i });

    expect(textarea).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('does not send when disabled', () => {
    const handleSend = vi.fn();
    render(<ChatInput placeholder="Type..." onSend={handleSend} disabled />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(handleSend).not.toHaveBeenCalled();
  });
});
