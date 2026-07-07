import { http, HttpResponse } from 'msw';

import { endpoints } from '@/shared/api/endpoints';

import {
  alertItems,
  dashboardOverview,
  regionRisks,
  resources,
  timelineEvents,
  trendPoints,
} from './data/dashboard';

export const handlers = [
  http.get(endpoints.dashboard.overview, () =>
    HttpResponse.json({
      ...dashboardOverview,
      updatedAt: new Date().toISOString(),
    }),
  ),
  http.get(endpoints.dashboard.trends, () => HttpResponse.json(trendPoints)),
  http.get(endpoints.dashboard.regions, () => HttpResponse.json(regionRisks)),
  http.get(endpoints.dashboard.alerts, () => HttpResponse.json(alertItems)),
  http.get(endpoints.dashboard.resources, () => HttpResponse.json(resources)),
  http.get(endpoints.dashboard.timeline, () => HttpResponse.json(timelineEvents)),
];
