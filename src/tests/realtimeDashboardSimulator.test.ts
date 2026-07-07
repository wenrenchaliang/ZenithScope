import { describe, expect, it } from 'vitest';

import {
  nextDashboardFrame,
  resetRealtimeDashboardSimulator,
} from '@/shared/mock/realtimeDashboardSimulator';

describe('realtime dashboard simulator', () => {
  it('changes data over consecutive frames while keeping ranges bounded', () => {
    resetRealtimeDashboardSimulator(new Date('2026-07-07T10:00:00.000Z'));

    const first = nextDashboardFrame(new Date('2026-07-07T10:00:02.000Z'));
    const second = nextDashboardFrame(new Date('2026-07-07T10:00:04.000Z'));

    const firstVisits = first.overview.metrics.find((metric) => metric.key === 'visitsToday');
    const secondVisits = second.overview.metrics.find((metric) => metric.key === 'visitsToday');
    const secondHealth = second.overview.metrics.find((metric) => metric.key === 'systemHealth');

    expect(second.overview.updatedAt).not.toBe(first.overview.updatedAt);
    expect(secondVisits?.value).toBeGreaterThanOrEqual(firstVisits?.value ?? 0);
    expect(secondVisits?.delta).toBeGreaterThanOrEqual(0);
    expect(secondHealth?.value).toBeGreaterThanOrEqual(95);
    expect(secondHealth?.value).toBeLessThanOrEqual(99.9);
    expect(second.trends.length).toBeGreaterThanOrEqual(8);
    expect(second.trends.length).toBeLessThanOrEqual(10);
    expect(second.timeline.length).toBeLessThanOrEqual(6);
    expect(second.alerts.length).toBeLessThanOrEqual(5);
    expect(second.regions.every((node) => node.riskScore >= 40 && node.riskScore <= 100)).toBe(
      true,
    );
  });
});
