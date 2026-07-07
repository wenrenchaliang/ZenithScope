import type { AlertItem, RegionRisk, ResourceItem } from '../types';

const severityWeight: Record<AlertItem['severity'], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function sortRegionsByRisk(regions: RegionRisk[]) {
  return [...regions].sort((a, b) => b.riskScore - a.riskScore);
}

export function sortAlertsBySeverity(alerts: AlertItem[]) {
  return [...alerts].sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);
}

export function getResourceTone(resource: ResourceItem) {
  if (resource.value >= 86 || resource.status === 'pressure') {
    return 'rose';
  }

  if (resource.value >= 72 || resource.status === 'busy') {
    return 'amber';
  }

  return 'green';
}
