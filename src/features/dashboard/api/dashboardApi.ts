import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import type {
  AlertItem,
  DashboardOverview,
  RegionRisk,
  ResourceItem,
  TimelineEvent,
  TrendPoint,
} from '../types';

export const dashboardApi = {
  getOverview() {
    return httpClient.get<DashboardOverview>(endpoints.dashboard.overview);
  },
  getTrends() {
    return httpClient.get<TrendPoint[]>(endpoints.dashboard.trends);
  },
  getRegions() {
    return httpClient.get<RegionRisk[]>(endpoints.dashboard.regions);
  },
  getAlerts() {
    return httpClient.get<AlertItem[]>(endpoints.dashboard.alerts);
  },
  getResources() {
    return httpClient.get<ResourceItem[]>(endpoints.dashboard.resources);
  },
  getTimeline() {
    return httpClient.get<TimelineEvent[]>(endpoints.dashboard.timeline);
  },
};
