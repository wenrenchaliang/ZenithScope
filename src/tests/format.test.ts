import { describe, expect, it } from 'vitest';

import { formatPercent, formatThroughput } from '@/shared/utils/format';

describe('format helpers', () => {
  it('formats percentages without decimals', () => {
    expect(formatPercent(73.4)).toBe('73%');
  });

  it('formats throughput in GB/s and TB/s', () => {
    expect(formatThroughput(684.7)).toBe('684.7 GB/s');
    expect(formatThroughput(1280)).toBe('1.3 TB/s');
  });
});
