import { cn } from '@/lib/utils';

describe('cn (className merge helper)', () => {
  it('merges truthy classes and ignores falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c');
  });

  it('merges tailwind classes with conflict resolution (tailwind-merge)', () => {
    // 'p-2' should be overridden by 'p-4'
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
