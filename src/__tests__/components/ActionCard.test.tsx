// Tests for ActionCard component
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionCard } from '../../components/ActionCard.js';
import type { AgentAction } from '../../types.js';

describe('ActionCard', () => {
  const createAction = (overrides: Partial<AgentAction> = {}): AgentAction => ({
    id: 'action-1',
    type: 'navigate',
    target: '/dashboard',
    confidence: 0.85,
    status: 'pending',
    ...overrides
  });

  it('renders action card', () => {
    const action = createAction();
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('/dashboard')).toBeInTheDocument();
  });

  it('displays action label for navigate type', () => {
    const action = createAction({ type: 'navigate' });
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('Navigate to')).toBeInTheDocument();
  });

  it('displays action label for fillForm type', () => {
    const action = createAction({ type: 'fillForm', target: '#email' });
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('Fill form field')).toBeInTheDocument();
  });

  it('displays action label for clickElement type', () => {
    const action = createAction({ type: 'clickElement', target: '#submit-btn' });
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('Click')).toBeInTheDocument();
  });

  it('displays explanation when provided', () => {
    const action = createAction({ explanation: 'This will take you to your dashboard' });
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('This will take you to your dashboard')).toBeInTheDocument();
  });

  it('does not render explanation when not provided', () => {
    const action = createAction({ explanation: undefined });
    const { container } = render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(container.querySelector('.astermind-action-card__explanation')).not.toBeInTheDocument();
  });

  it('displays confidence percentage', () => {
    const action = createAction({ confidence: 0.85 });
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('85% confident')).toBeInTheDocument();
  });

  it('rounds confidence percentage', () => {
    const action = createAction({ confidence: 0.876 });
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('88% confident')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', () => {
    const handleConfirm = vi.fn();
    const action = createAction();
    render(<ActionCard action={action} onConfirm={handleConfirm} onCancel={() => {}} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button clicked', () => {
    const handleCancel = vi.fn();
    const action = createAction();
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={handleCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('renders both confirm and cancel buttons', () => {
    const action = createAction();
    render(<ActionCard action={action} onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});
