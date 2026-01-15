// Tests for SourceCitation component
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SourceCitation } from '../../components/SourceCitation.js';
import type { Source } from '../../types.js';

describe('SourceCitation', () => {
  const mockSources: Source[] = [
    { title: 'Source 1', snippet: 'First source content', relevance: 0.95 },
    { title: 'Source 2', snippet: 'Second source content', relevance: 0.82 },
    { title: 'Source 3', snippet: 'Third source content', relevance: 0.71 }
  ];

  it('renders all sources', () => {
    render(<SourceCitation sources={mockSources} />);

    expect(screen.getByText('Source 1')).toBeInTheDocument();
    expect(screen.getByText('Source 2')).toBeInTheDocument();
    expect(screen.getByText('Source 3')).toBeInTheDocument();
  });

  it('displays source snippets', () => {
    render(<SourceCitation sources={mockSources} />);

    expect(screen.getByText('First source content')).toBeInTheDocument();
    expect(screen.getByText('Second source content')).toBeInTheDocument();
  });

  it('displays relevance as percentage', () => {
    render(<SourceCitation sources={mockSources} />);

    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('82%')).toBeInTheDocument();
    expect(screen.getByText('71%')).toBeInTheDocument();
  });

  it('renders empty container for empty sources array', () => {
    const { container } = render(<SourceCitation sources={[]} />);
    const sources = container.querySelectorAll('.astermind-source');
    expect(sources).toHaveLength(0);
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<SourceCitation sources={mockSources} />);

    expect(container.querySelector('.astermind-sources')).toBeInTheDocument();
    expect(container.querySelectorAll('.astermind-source')).toHaveLength(3);
  });

  it('rounds relevance percentages correctly', () => {
    const sources: Source[] = [
      { title: 'Test', snippet: 'Content', relevance: 0.876 }
    ];
    render(<SourceCitation sources={sources} />);

    expect(screen.getByText('88%')).toBeInTheDocument();
  });
});
