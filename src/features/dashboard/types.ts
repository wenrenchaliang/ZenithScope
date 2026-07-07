export type SystemStatus = 'nominal' | 'warning' | 'critical';

export type MetricKey =
  | 'devicesOnline'
  | 'eventsToday'
  | 'activeAlerts'
  | 'throughput'
  | 'visitsToday'
  | 'realtimeTasks'
  | 'activeLearners'
  | 'systemHealth';

export type MetricItem = {
  key: MetricKey;
  label: string;
  value: number;
  unit: string;
  delta: number;
  tone: 'cyan' | 'green' | 'amber' | 'rose' | 'violet';
};

export type DashboardOverview = {
  status: SystemStatus;
  updatedAt: string;
  metrics: MetricItem[];
};

export type TrendPoint = {
  hour: string;
  events: number;
  alerts: number;
};

export type RegionRisk = {
  id: string;
  name: string;
  riskScore: number;
  onlineDevices: number;
  incidentCount: number;
  coordinates: [number, number];
};

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AlertItem = {
  id: string;
  region: string;
  title: string;
  severity: AlertSeverity;
  source: string;
  time: string;
};

export type ResourceItem = {
  key: 'cpu' | 'memory' | 'network' | 'storage';
  label: string;
  value: number;
  capacity: string;
  status: 'stable' | 'busy' | 'pressure';
};

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  region: string;
  type: 'ingest' | 'dispatch' | 'recover' | 'detect';
};

export type DashboardData = {
  overview: DashboardOverview;
  trends: TrendPoint[];
  regions: RegionRisk[];
  alerts: AlertItem[];
  resources: ResourceItem[];
  timeline: TimelineEvent[];
};
