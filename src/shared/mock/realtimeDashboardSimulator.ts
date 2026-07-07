import type {
  AlertItem,
  DashboardData,
  DashboardOverview,
  MetricItem,
  RegionRisk,
  ResourceItem,
  TimelineEvent,
  TrendPoint,
} from '@/features/dashboard/types';

const FRAME_INTERVAL_MS = 2_000;
const TREND_WINDOW_SIZE = 10;
const MAX_ACTIVITY_ITEMS = 6;
const MAX_ALERT_ITEMS = 5;

type MutableDashboardState = DashboardData & {
  sequence: number;
};

const hubNodeTemplates: RegionRisk[] = [
  {
    id: 'learning-center',
    name: '课程学习',
    riskScore: 86,
    onlineDevices: 28460,
    incidentCount: 58,
    coordinates: [34, 58],
  },
  {
    id: 'project-lab',
    name: '项目实战',
    riskScore: 82,
    onlineDevices: 23920,
    incidentCount: 51,
    coordinates: [66, 55],
  },
  {
    id: 'chart-library',
    name: '图表组件',
    riskScore: 76,
    onlineDevices: 18640,
    incidentCount: 43,
    coordinates: [52, 44],
  },
  {
    id: 'qa-hub',
    name: '问答互动',
    riskScore: 68,
    onlineDevices: 15420,
    incidentCount: 35,
    coordinates: [75, 31],
  },
  {
    id: 'teacher-console',
    name: '教师端',
    riskScore: 63,
    onlineDevices: 12160,
    incidentCount: 29,
    coordinates: [28, 30],
  },
  {
    id: 'data-service',
    name: '数据服务',
    riskScore: 72,
    onlineDevices: 17680,
    incidentCount: 39,
    coordinates: [48, 23],
  },
];

const activityMessages = [
  '学习中心完成新一轮访问数据同步',
  '可视化案例库同步 12 条练习记录',
  '学员端新增一批项目实战提交',
  '教师端发布新的课堂任务',
  '数据质量巡检通过，异常值已自动标记',
  '问答互动区新增高频问题聚类结果',
  'ZenithScope 数据中枢完成一次指标刷新',
  '大屏组件示例库完成状态校验',
];

const warningMessages = [
  '华东教学节点接口延迟轻微升高，已切换备用通道',
  '告警中心发现轻微波动，正在持续观察',
  '项目实战提交队列短时拥塞，已进入缓冲处理',
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function cloneDashboardData(data: DashboardData): DashboardData {
  return {
    overview: {
      ...data.overview,
      metrics: data.overview.metrics.map((metric) => ({ ...metric })),
    },
    trends: data.trends.map((point) => ({ ...point })),
    regions: data.regions.map((region) => ({
      ...region,
      coordinates: [...region.coordinates],
    })),
    alerts: data.alerts.map((alert) => ({ ...alert })),
    resources: data.resources.map((resource) => ({ ...resource })),
    timeline: data.timeline.map((event) => ({ ...event })),
  };
}

function createInitialTrends(now: Date): TrendPoint[] {
  return Array.from({ length: TREND_WINDOW_SIZE }, (_, index) => {
    const pointTime = new Date(now.getTime() - (TREND_WINDOW_SIZE - index - 1) * FRAME_INTERVAL_MS);
    return {
      hour: formatTime(pointTime),
      events: Math.round(1040 + Math.sin(index / 1.7) * 120 + index * 32),
      alerts: Math.round(28 + Math.cos(index / 2) * 5 + index * 1.8),
    };
  });
}

function createInitialOverview(now: Date): DashboardOverview {
  return {
    status: 'nominal',
    updatedAt: now.toISOString(),
    metrics: [
      {
        key: 'visitsToday',
        label: '今日访问量',
        value: 128642,
        unit: '',
        delta: 0,
        tone: 'cyan',
      },
      {
        key: 'realtimeTasks',
        label: '实时任务数',
        value: 3847,
        unit: '项',
        delta: 0,
        tone: 'green',
      },
      {
        key: 'activeLearners',
        label: '活跃用户数',
        value: 12260,
        unit: '人',
        delta: 0,
        tone: 'violet',
      },
      {
        key: 'systemHealth',
        label: '系统健康度',
        value: 98.6,
        unit: '%',
        delta: 0,
        tone: 'amber',
      },
    ],
  };
}

function createInitialTimeline(now: Date): TimelineEvent[] {
  return [
    {
      id: `T-${now.getTime()}-1`,
      time: formatTime(now),
      title: 'ZenithScope 数据中枢完成一次指标刷新',
      region: '数据服务',
      type: 'dispatch',
    },
    {
      id: `T-${now.getTime()}-2`,
      time: formatTime(new Date(now.getTime() - 60_000)),
      title: '可视化案例库同步 12 条练习记录',
      region: '图表组件',
      type: 'ingest',
    },
    {
      id: `T-${now.getTime()}-3`,
      time: formatTime(new Date(now.getTime() - 120_000)),
      title: '教师端发布新的课堂任务',
      region: '教师端',
      type: 'detect',
    },
    {
      id: `T-${now.getTime()}-4`,
      time: formatTime(new Date(now.getTime() - 180_000)),
      title: '数据质量巡检通过，异常值已自动标记',
      region: '学习中心',
      type: 'recover',
    },
  ];
}

function createInitialAlerts(now: Date): AlertItem[] {
  return [
    {
      id: `A-${now.getTime()}-1`,
      region: '华东教学节点',
      title: '接口延迟轻微升高，已切换备用通道',
      severity: 'medium',
      source: '数据服务',
      time: formatTime(now),
    },
    {
      id: `A-${now.getTime()}-2`,
      region: '项目实战',
      title: '提交队列短时拥塞，正在缓冲处理',
      severity: 'low',
      source: '任务队列',
      time: formatTime(new Date(now.getTime() - 90_000)),
    },
  ];
}

function createInitialResources(): ResourceItem[] {
  return [
    { key: 'cpu', label: 'CPU', value: 62, capacity: '384 Cores', status: 'stable' },
    { key: 'memory', label: '内存', value: 68, capacity: '2.8 TB', status: 'stable' },
    { key: 'network', label: '网络', value: 74, capacity: '920 Gbps', status: 'busy' },
    { key: 'storage', label: '存储', value: 57, capacity: '18.6 PB', status: 'stable' },
  ];
}

function createInitialState(now = new Date()): MutableDashboardState {
  return {
    sequence: 0,
    overview: createInitialOverview(now),
    trends: createInitialTrends(now),
    regions: hubNodeTemplates.map((region) => ({ ...region })),
    alerts: createInitialAlerts(now),
    resources: createInitialResources(),
    timeline: createInitialTimeline(now),
  };
}

function updateMetric(metric: MetricItem, nextValue: number): MetricItem {
  const delta = metric.value === 0 ? 0 : ((nextValue - metric.value) / metric.value) * 100;
  return {
    ...metric,
    value: nextValue,
    delta: round(delta, 1),
  };
}

function updateSummaryMetrics(overview: DashboardOverview, now: Date): DashboardOverview {
  const nextMetrics = overview.metrics.map((metric) => {
    if (metric.key === 'visitsToday') {
      return updateMetric(metric, metric.value + randomInt(20, 300));
    }

    if (metric.key === 'realtimeTasks') {
      return updateMetric(metric, clampValue(metric.value + randomInt(-12, 80), 800, 9_999));
    }

    if (metric.key === 'activeLearners') {
      const changeRate = randomFloat(-0.018, 0.026);
      return updateMetric(
        metric,
        Math.round(clampValue(metric.value * (1 + changeRate), 1_000, 80_000)),
      );
    }

    if (metric.key === 'systemHealth') {
      const occasionalDip = Math.random() < 0.12 ? randomFloat(-1.2, -0.35) : 0;
      const nextHealth = round(
        clampValue(metric.value + randomFloat(-0.16, 0.18) + occasionalDip, 95, 99.9),
        1,
      );
      return updateMetric(metric, nextHealth);
    }

    return metric;
  });

  const health = nextMetrics.find((metric) => metric.key === 'systemHealth')?.value ?? 98;

  return {
    status: health < 96.4 ? 'warning' : 'nominal',
    updatedAt: now.toISOString(),
    metrics: nextMetrics,
  };
}

function updateTrendWindow(
  trends: TrendPoint[],
  overview: DashboardOverview,
  now: Date,
): TrendPoint[] {
  const visitsDelta = overview.metrics.find((metric) => metric.key === 'visitsToday')?.delta ?? 0;
  const taskValue =
    overview.metrics.find((metric) => metric.key === 'realtimeTasks')?.value ?? 3_000;
  const latest = trends.at(-1) ?? { events: 1_100, alerts: 32, hour: formatTime(now) };
  const nextPoint: TrendPoint = {
    hour: formatTime(now),
    events: Math.round(
      clampValue(latest.events + visitsDelta * 9 + randomInt(-80, 150), 620, 1_980),
    ),
    alerts: Math.round(clampValue(taskValue / 120 + randomInt(-4, 7), 16, 90)),
  };

  return [...trends, nextPoint].slice(-TREND_WINDOW_SIZE);
}

function pickWeightedActivityType(): TimelineEvent['type'] {
  const roll = Math.random();
  if (roll < 0.34) return 'ingest';
  if (roll < 0.64) return 'dispatch';
  if (roll < 0.84) return 'recover';
  return 'detect';
}

function createRealtimeActivity(now: Date, sequence: number): TimelineEvent {
  const isWarning = Math.random() < 0.2;
  const title = isWarning
    ? warningMessages[randomInt(0, warningMessages.length - 1)]
    : activityMessages[randomInt(0, activityMessages.length - 1)];

  return {
    id: `T-${now.getTime()}-${sequence}`,
    time: formatTime(now),
    title,
    region: isWarning ? '告警中心' : '教学数据中心',
    type: isWarning ? 'detect' : pickWeightedActivityType(),
  };
}

function updateActivities(timeline: TimelineEvent[], now: Date, sequence: number): TimelineEvent[] {
  if (sequence % randomInt(2, 3) !== 0) {
    return timeline;
  }

  return [createRealtimeActivity(now, sequence), ...timeline].slice(0, MAX_ACTIVITY_ITEMS);
}

function createRealtimeAlert(now: Date, sequence: number, health: number): AlertItem {
  const healthWarning = health < 96.4;
  return {
    id: `A-${now.getTime()}-${sequence}`,
    region: healthWarning ? '系统健康度' : '告警中心',
    title: healthWarning
      ? '系统健康度短时下探，正在持续观察'
      : warningMessages[randomInt(0, warningMessages.length - 1)],
    severity: healthWarning ? 'medium' : 'low',
    source: healthWarning ? '健康巡检' : '实时模拟器',
    time: formatTime(now),
  };
}

function updateAlerts(
  alerts: AlertItem[],
  overview: DashboardOverview,
  now: Date,
  sequence: number,
): AlertItem[] {
  const health = overview.metrics.find((metric) => metric.key === 'systemHealth')?.value ?? 98;
  if (health >= 96.4 && (sequence % 3 !== 0 || Math.random() > 0.24)) {
    return alerts;
  }

  return [createRealtimeAlert(now, sequence, health), ...alerts].slice(0, MAX_ALERT_ITEMS);
}

function updateHubNodes(regions: RegionRisk[], sequence: number): RegionRisk[] {
  const rankingRefresh = sequence % 5 === 0;

  return regions.map((region) => {
    const nextRisk = Math.round(clampValue(region.riskScore + randomInt(-4, 5), 40, 100));
    const visitIncrement = rankingRefresh ? randomInt(18, 220) : randomInt(0, 24);
    const interactionIncrement = rankingRefresh ? randomInt(0, 8) : randomInt(0, 2);

    return {
      ...region,
      riskScore: nextRisk,
      onlineDevices: region.onlineDevices + visitIncrement,
      incidentCount: Math.round(
        clampValue(region.incidentCount + interactionIncrement + randomInt(-1, 2), 6, 180),
      ),
    };
  });
}

function updateResources(resources: ResourceItem[]): ResourceItem[] {
  return resources.map((resource) => {
    const nextValue = Math.round(clampValue(resource.value + randomInt(-2, 3), 35, 92));
    return {
      ...resource,
      value: nextValue,
      status: nextValue >= 86 ? 'pressure' : nextValue >= 72 ? 'busy' : 'stable',
    };
  });
}

function createNextFrame(state: MutableDashboardState, now: Date): MutableDashboardState {
  const sequence = state.sequence + 1;
  const overview = updateSummaryMetrics(state.overview, now);
  const trends = updateTrendWindow(state.trends, overview, now);
  const regions = updateHubNodes(state.regions, sequence);
  const timeline = updateActivities(state.timeline, now, sequence);
  const alerts = updateAlerts(state.alerts, overview, now, sequence);
  const resources = updateResources(state.resources);

  return {
    sequence,
    overview,
    trends,
    regions,
    alerts,
    resources,
    timeline,
  };
}

let currentState = createInitialState();
let lastFrameAt = 0;

export function resetRealtimeDashboardSimulator(now = new Date()) {
  currentState = createInitialState(now);
  lastFrameAt = now.getTime();
}

export function nextDashboardFrame(now = new Date()): DashboardData {
  currentState = createNextFrame(currentState, now);
  lastFrameAt = now.getTime();
  return cloneDashboardData(currentState);
}

export function getRealtimeDashboardData(now = new Date()): DashboardData {
  if (lastFrameAt === 0) {
    lastFrameAt = now.getTime();
    currentState.overview = {
      ...currentState.overview,
      updatedAt: now.toISOString(),
    };
    return cloneDashboardData(currentState);
  }

  if (now.getTime() - lastFrameAt >= FRAME_INTERVAL_MS) {
    return nextDashboardFrame(now);
  }

  return cloneDashboardData(currentState);
}
