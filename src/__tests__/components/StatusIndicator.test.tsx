// Tests for StatusIndicator component
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusIndicator } from '../../components/StatusIndicator.js';

describe('StatusIndicator', () => {
  it('displays "Online" for online status', () => {
    render(<StatusIndicator status="online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('displays "Offline" for offline status', () => {
    render(<StatusIndicator status="offline" />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('displays "Connecting..." for connecting status', () => {
    render(<StatusIndicator status="connecting" />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('displays "Error" for error status', () => {
    render(<StatusIndicator status="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('applies correct CSS class for online status', () => {
    const { container } = render(<StatusIndicator status="online" />);
    const indicator = container.firstChild;
    expect(indicator).toHaveClass('astermind-status--online');
  });

  it('applies correct CSS class for offline status', () => {
    const { container } = render(<StatusIndicator status="offline" />);
    const indicator = container.firstChild;
    expect(indicator).toHaveClass('astermind-status--offline');
  });

  it('applies correct CSS class for connecting status', () => {
    const { container } = render(<StatusIndicator status="connecting" />);
    const indicator = container.firstChild;
    expect(indicator).toHaveClass('astermind-status--connecting');
  });

  it('applies correct CSS class for error status', () => {
    const { container } = render(<StatusIndicator status="error" />);
    const indicator = container.firstChild;
    expect(indicator).toHaveClass('astermind-status--error');
  });

  it('renders status dot element', () => {
    const { container } = render(<StatusIndicator status="online" />);
    const dot = container.querySelector('.astermind-status__dot');
    expect(dot).toBeInTheDocument();
  });
});
