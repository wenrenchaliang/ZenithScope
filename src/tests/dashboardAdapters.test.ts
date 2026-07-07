import { describe, expect, it } from 'vitest';

import {
  getResourceTone,
  sortAlertsBySeverity,
  sortRegionsByRisk,
} from '@/features/dashboard/model/adapters';
import type { AlertItem, RegionRisk, ResourceItem } from '@/features/dashboard/types';

describe('dashboard adapters', () => {
  it('sorts regions by risk score descending', () => {
    const regions = [
      {
        id: 'a',
        name: 'A',
        riskScore: 44,
        onlineDevices: 1,
        incidentCount: 1,
        coordinates: [0, 0],
      },
      {
        id: 'b',
        name: 'B',
        riskScore: 91,
        onlineDevices: 1,
        incidentCount: 1,
        coordinates: [0, 0],
      },
    ] satisfies RegionRisk[];

    expect(sortRegionsByRisk(regions).map((region) => region.id)).toEqual(['b', 'a']);
  });

  it('sorts alerts by severity priority', () => {
    const alerts = [
      { id: 'low', severity: 'low', title: 'low', region: 'A', source: 'S', time: '10:00' },
      {
        id: 'critical',
        severity: 'critical',
        title: 'critical',
        region: 'B',
        source: 'S',
        time: '10:01',
      },
      { id: 'high', severity: 'high', title: 'high', region: 'C', source: 'S', time: '10:02' },
    ] satisfies AlertItem[];

    expect(sortAlertsBySeverity(alerts).map((alert) => alert.id)).toEqual([
      'critical',
      'high',
      'low',
    ]);
  });

  it('maps resource pressure to visual tone', () => {
    const resource = {
      key: 'network',
      label: '网络',
      value: 88,
      capacity: '920 Gbps',
      status: 'busy',
    } satisfies ResourceItem;

    expect(getResourceTone(resource)).toBe('rose');
  });
});
