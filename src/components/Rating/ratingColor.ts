export const RATING_COLORS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  AVERAGE: 'average',
  POOR: 'poor',
} as const;

export function ratingColor(v: number): string {
  if (v >= 8.0) return RATING_COLORS.EXCELLENT;
  if (v >= 6.0) return RATING_COLORS.GOOD;
  if (v >= 4.0) return RATING_COLORS.AVERAGE;
  return RATING_COLORS.POOR;
}
