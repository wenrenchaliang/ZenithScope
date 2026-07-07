import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { dashboardApi } from '@/features/dashboard/api/dashboardApi';
import { handlers } from '@/shared/mock/handlers';
import { resetRealtimeDashboardSimulator } from '@/shared/mock/realtimeDashboardSimulator';

const server = setupServer(...handlers);

describe('dashboard api with mock handlers', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('returns a complete DashboardData payload through the API layer', async () => {
    resetRealtimeDashboardSimulator(new Date('2026-07-07T10:00:00.000Z'));

    const data = await dashboardApi.getDashboardData();

    expect(data.overview.metrics.length).toBe(4);
    expect(data.trends.length).toBeGreaterThan(0);
    expect(data.regions.length).toBeGreaterThan(0);
    expect(data.alerts.length).toBeGreaterThan(0);
    expect(data.resources.length).toBeGreaterThan(0);
    expect(data.timeline.length).toBeGreaterThan(0);
  });
});
