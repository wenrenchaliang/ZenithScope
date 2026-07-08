import cors from 'cors';
import express from 'express';

import { getDashboardData } from './dashboardService.js';
import { pool } from './db.js';

const app = express();
const port = Number(process.env.API_PORT ?? 3001);

let cachedDashboard = null;
let cachedAt = 0;
const cacheTtlMs = Number(process.env.API_CACHE_TTL_MS ?? 5000);

app.use(cors());
app.use(express.json());

async function dashboard() {
  const now = Date.now();
  if (cachedDashboard && now - cachedAt < cacheTtlMs) {
    return cachedDashboard;
  }

  cachedDashboard = await getDashboardData();
  cachedAt = now;
  return cachedDashboard;
}

function asyncHandler(handler) {
  return async (request, response, next) => {
    try {
      await handler(request, response, next);
    } catch (error) {
      next(error);
    }
  };
}

app.get('/api/health', asyncHandler(async (_request, response) => {
  await pool.query('SELECT 1');
  response.json({ ok: true });
}));

app.get('/api/dashboard/overview', asyncHandler(async (_request, response) => {
  response.json((await dashboard()).overview);
}));

app.get('/api/dashboard/trends', asyncHandler(async (_request, response) => {
  response.json((await dashboard()).trends);
}));

app.get('/api/dashboard/regions', asyncHandler(async (_request, response) => {
  response.json((await dashboard()).regions);
}));

app.get('/api/dashboard/alerts', asyncHandler(async (_request, response) => {
  response.json((await dashboard()).alerts);
}));

app.get('/api/dashboard/resources', asyncHandler(async (_request, response) => {
  response.json((await dashboard()).resources);
}));

app.get('/api/dashboard/timeline', asyncHandler(async (_request, response) => {
  response.json((await dashboard()).timeline);
}));

app.use((error, _request, response, _next) => {
  void _next;
  console.error(error);
  response.status(500).json({
    message: 'Dashboard API failed',
    detail: error instanceof Error ? error.message : String(error),
  });
});

app.listen(port, () => {
  console.log(`ZenithScope API listening on http://127.0.0.1:${port}`);
});
