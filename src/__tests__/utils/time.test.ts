// Tests for time utility
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTime } from '../../utils/time.js';

describe('formatTime', () => {
  beforeEach(() => {
    // Mock current time to 2026-01-15 12:00:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" for times less than a minute ago', () => {
    const now = new Date();
    expect(formatTime(now)).toBe('Just now');

    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    expect(formatTime(thirtySecondsAgo)).toBe('Just now');

    const fiftyNineSecondsAgo = new Date(Date.now() - 59 * 1000);
    expect(formatTime(fiftyNineSecondsAgo)).toBe('Just now');
  });

  it('returns minutes ago for times less than an hour ago', () => {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    expect(formatTime(oneMinuteAgo)).toBe('1m ago');

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatTime(fiveMinutesAgo)).toBe('5m ago');

    const fiftyNineMinutesAgo = new Date(Date.now() - 59 * 60 * 1000);
    expect(formatTime(fiftyNineMinutesAgo)).toBe('59m ago');
  });

  it('returns time for same day', () => {
    // 2 hours ago, same day
    const twoHoursAgo = new Date('2026-01-15T10:00:00');
    const result = formatTime(twoHoursAgo);
    // Should be in format like "10:00 AM" or "10:00"
    expect(result).toMatch(/10:00/);
  });

  it('returns date for different day', () => {
    const yesterday = new Date('2026-01-14T12:00:00');
    const result = formatTime(yesterday);
    // Should include "Jan 14" or similar
    expect(result).toMatch(/Jan.*14|14.*Jan/i);
  });

  it('returns date for older dates', () => {
    const lastMonth = new Date('2025-12-15T12:00:00');
    const result = formatTime(lastMonth);
    // Should include "Dec 15" or similar
    expect(result).toMatch(/Dec.*15|15.*Dec/i);
  });
});
