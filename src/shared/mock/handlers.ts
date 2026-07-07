import { http, HttpResponse } from 'msw';

import { endpoints } from '@/shared/api/endpoints';

import { getRealtimeDashboardData } from './realtimeDashboardSimulator';

export const handlers = [
  http.get(endpoints.dashboard.overview, () =>
    HttpResponse.json(getRealtimeDashboardData().overview),
  ),
  http.get(endpoints.dashboard.trends, () => HttpResponse.json(getRealtimeDashboardData().trends)),
  http.get(endpoints.dashboard.regions, () =>
    HttpResponse.json(getRealtimeDashboardData().regions),
  ),
  http.get(endpoints.dashboard.alerts, () => HttpResponse.json(getRealtimeDashboardData().alerts)),
  http.get(endpoints.dashboard.resources, () =>
    HttpResponse.json(getRealtimeDashboardData().resources),
  ),
  http.get(endpoints.dashboard.timeline, () =>
    HttpResponse.json(getRealtimeDashboardData().timeline),
  ),
];
