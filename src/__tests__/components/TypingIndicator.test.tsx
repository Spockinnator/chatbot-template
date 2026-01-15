// Tests for TypingIndicator component
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TypingIndicator } from '../../components/TypingIndicator.js';

describe('TypingIndicator', () => {
  it('renders typing indicator container', () => {
    const { container } = render(<TypingIndicator />);
    const indicator = container.querySelector('.astermind-typing');
    expect(indicator).toBeInTheDocument();
  });

  it('renders three dots for animation', () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll('.astermind-typing span');
    expect(dots).toHaveLength(3);
  });
});
