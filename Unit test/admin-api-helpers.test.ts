jest.mock('next/server');

import {
  decimalToNumber,
  validateNumericId,
  calculatePercentageChange,
  formatDate,
  getMonthlyDateRanges,
  errorResponse,
  successResponse,
} from '@/lib/admin-api-helpers';

describe('admin-api-helpers (pure utilities)', () => {
  it('decimalToNumber converts numeric-like values safely', () => {
    expect(decimalToNumber(12.5)).toBe(12.5);
    expect(decimalToNumber('7')).toBe(7);
    expect(decimalToNumber(null)).toBe(0);
  });

  it('validateNumericId validates ids', () => {
    expect(validateNumericId('123')).toBe(true);
    expect(validateNumericId(123)).toBe(true);
    expect(validateNumericId('abc')).toBe(false);
    expect(validateNumericId(undefined)).toBe(false);
  });

  it('calculatePercentageChange handles edge cases', () => {
    expect(calculatePercentageChange(100, 150)).toBe(50);
    expect(calculatePercentageChange(0, 10)).toBe(100);
    expect(calculatePercentageChange(0, 0)).toBe(0);
  });

  it('formatDate returns a readable string', () => {
    const d = new Date('2024-01-15T00:00:00Z');
    expect(formatDate(d)).toMatch(/2024/);
  });

  it('getMonthlyDateRanges returns correct month boundaries', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-03-15T12:00:00Z'));
    const { currentMonthStart, currentMonthEnd, lastMonthStart, lastMonthEnd } = getMonthlyDateRanges();

    expect(currentMonthStart.getFullYear()).toBe(2024);
    expect(currentMonthStart.getMonth()).toBe(2); // March (0-based)
    expect(currentMonthStart.getDate()).toBe(1);

    expect(currentMonthEnd.getMonth()).toBe(2);
    expect(currentMonthEnd.getDate()).toBe(31);

    expect(lastMonthStart.getMonth()).toBe(1); // Feb
    expect(lastMonthStart.getDate()).toBe(1);

    expect(lastMonthEnd.getMonth()).toBe(1);
    expect(lastMonthEnd.getDate()).toBe(29); // 2024 leap year

    jest.useRealTimers();
  });

  it('errorResponse/successResponse produce expected shape', async () => {
    // These functions return NextResponse objects; we validate key fields by reading json()
    const ok = successResponse({ hello: 'world' });
    const okBody = await ok.json();
    expect(okBody).toEqual({ success: true, hello: 'world' });

    const err = errorResponse('Bad', 400);
    expect(err.status).toBe(400);
    const errBody = await err.json();
    expect(errBody).toMatchObject({ success: false, error: 'Bad' });
  });
});
