import { useQueries } from '@tanstack/react-query';

import { dashboardApi } from '../api/dashboardApi';
import type { DashboardData } from '../types';

const dashboardQueryKeys = {
  overview: ['dashboard', 'overview'] as const,
  trends: ['dashboard', 'trends'] as const,
  regions: ['dashboard', 'regions'] as const,
  alerts: ['dashboard', 'alerts'] as const,
  resources: ['dashboard', 'resources'] as const,
  timeline: ['dashboard', 'timeline'] as const,
};

export function useDashboardQueries(refreshEnabled: boolean) {
  const refetchInterval = refreshEnabled ? 30_000 : false;

  const [overview, trends, regions, alerts, resources, timeline] = useQueries({
    queries: [
      {
        queryKey: dashboardQueryKeys.overview,
        queryFn: () => dashboardApi.getOverview(),
        refetchInterval,
      },
      {
        queryKey: dashboardQueryKeys.trends,
        queryFn: () => dashboardApi.getTrends(),
        refetchInterval,
      },
      {
        queryKey: dashboardQueryKeys.regions,
        queryFn: () => dashboardApi.getRegions(),
        refetchInterval,
      },
      {
        queryKey: dashboardQueryKeys.alerts,
        queryFn: () => dashboardApi.getAlerts(),
        refetchInterval,
      },
      {
        queryKey: dashboardQueryKeys.resources,
        queryFn: () => dashboardApi.getResources(),
        refetchInterval,
      },
      {
        queryKey: dashboardQueryKeys.timeline,
        queryFn: () => dashboardApi.getTimeline(),
        refetchInterval,
      },
    ],
  });

  const data =
    overview.data && trends.data && regions.data && alerts.data && resources.data && timeline.data
      ? ({
          overview: overview.data,
          trends: trends.data,
          regions: regions.data,
          alerts: alerts.data,
          resources: resources.data,
          timeline: timeline.data,
        } satisfies DashboardData)
      : null;

  return {
    data,
    isLoading: [overview, trends, regions, alerts, resources, timeline].some(
      (query) => query.isLoading,
    ),
    isError: [overview, trends, regions, alerts, resources, timeline].some(
      (query) => query.isError,
    ),
  };
}
