import { describe, expect, it } from 'vitest';
import { RATING_COLORS, ratingColor } from './ratingColor';

describe('ratingColor', () => {
  it('должен возвращать excellent для рейтинга от 8', () => {
    expect(ratingColor(8)).toBe(RATING_COLORS.EXCELLENT);
    expect(ratingColor(9.5)).toBe(RATING_COLORS.EXCELLENT);
  });

  it('должен возвращать good для рейтинга от 6 до 7.9', () => {
    expect(ratingColor(6)).toBe(RATING_COLORS.GOOD);
    expect(ratingColor(7.9)).toBe(RATING_COLORS.GOOD);
  });

  it('должен возвращать average для рейтинга от 4 до 5.9', () => {
    expect(ratingColor(4)).toBe(RATING_COLORS.AVERAGE);
    expect(ratingColor(5.9)).toBe(RATING_COLORS.AVERAGE);
  });

  it('должен возвращать poor для рейтинга ниже 4', () => {
    expect(ratingColor(3.9)).toBe(RATING_COLORS.POOR);
    expect(ratingColor(0)).toBe(RATING_COLORS.POOR);
  });
});
