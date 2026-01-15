// Tests for markdown utility
import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../../utils/markdown.js';

describe('renderMarkdown', () => {
  it('returns empty string for empty input', () => {
    expect(renderMarkdown('')).toBe('');
  });

  it('returns empty string for null/undefined input', () => {
    expect(renderMarkdown(null as unknown as string)).toBe('');
    expect(renderMarkdown(undefined as unknown as string)).toBe('');
  });

  it('escapes HTML entities', () => {
    expect(renderMarkdown('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert("xss")&lt;/script&gt;'
    );
    expect(renderMarkdown('a & b')).toBe('a &amp; b');
    expect(renderMarkdown('1 > 0 < 2')).toBe('1 &gt; 0 &lt; 2');
  });

  it('renders bold text', () => {
    expect(renderMarkdown('**bold**')).toBe('<strong>bold</strong>');
    expect(renderMarkdown('text **bold** more')).toBe('text <strong>bold</strong> more');
  });

  it('renders italic text', () => {
    expect(renderMarkdown('*italic*')).toBe('<em>italic</em>');
    expect(renderMarkdown('text *italic* more')).toBe('text <em>italic</em> more');
  });

  it('renders inline code', () => {
    expect(renderMarkdown('`code`')).toBe('<code>code</code>');
    expect(renderMarkdown('use `npm install`')).toBe('use <code>npm install</code>');
  });

  it('renders links', () => {
    expect(renderMarkdown('[text](https://example.com)')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">text</a>'
    );
  });

  it('converts newlines to br tags', () => {
    expect(renderMarkdown('line1\nline2')).toBe('line1<br />line2');
  });

  it('handles mixed markdown', () => {
    const input = '**Bold** and *italic* with `code`';
    const expected = '<strong>Bold</strong> and <em>italic</em> with <code>code</code>';
    expect(renderMarkdown(input)).toBe(expected);
  });

  it('handles nested formatting', () => {
    const input = '**bold with `code` inside**';
    const expected = '<strong>bold with <code>code</code> inside</strong>';
    expect(renderMarkdown(input)).toBe(expected);
  });
});
