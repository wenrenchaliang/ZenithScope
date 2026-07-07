import type {
  AlertItem,
  DashboardOverview,
  RegionRisk,
  ResourceItem,
  TimelineEvent,
  TrendPoint,
} from '@/features/dashboard/types';

export const dashboardOverview: DashboardOverview = {
  status: 'warning',
  updatedAt: new Date().toISOString(),
  metrics: [
    {
      key: 'devicesOnline',
      label: '在线设备数',
      value: 128642,
      unit: '台',
      delta: 4.8,
      tone: 'cyan',
    },
    {
      key: 'eventsToday',
      label: '今日事件数',
      value: 38472,
      unit: '件',
      delta: 12.4,
      tone: 'green',
    },
    {
      key: 'activeAlerts',
      label: '告警数量',
      value: 286,
      unit: '条',
      delta: -6.1,
      tone: 'rose',
    },
    {
      key: 'throughput',
      label: '数据吞吐量',
      value: 684.7,
      unit: 'GB/s',
      delta: 8.6,
      tone: 'violet',
    },
  ],
};

export const trendPoints: TrendPoint[] = Array.from({ length: 24 }, (_, index) => {
  const hour = `${String(index).padStart(2, '0')}:00`;
  return {
    hour,
    events: Math.round(820 + Math.sin(index / 2.7) * 210 + index * 18 + (index % 5) * 44),
    alerts: Math.round(24 + Math.cos(index / 3.2) * 9 + (index % 4) * 4),
  };
});

export const regionRisks: RegionRisk[] = [
  {
    id: 'north-hub',
    name: '北城枢纽',
    riskScore: 92,
    onlineDevices: 18420,
    incidentCount: 74,
    coordinates: [34, 22],
  },
  {
    id: 'river-port',
    name: '滨江港区',
    riskScore: 86,
    onlineDevices: 14280,
    incidentCount: 62,
    coordinates: [66, 58],
  },
  {
    id: 'east-grid',
    name: '东部电网',
    riskScore: 78,
    onlineDevices: 21790,
    incidentCount: 48,
    coordinates: [76, 30],
  },
  {
    id: 'central-core',
    name: '中央核心区',
    riskScore: 71,
    onlineDevices: 26310,
    incidentCount: 39,
    coordinates: [50, 45],
  },
  {
    id: 'airport-zone',
    name: '空港片区',
    riskScore: 64,
    onlineDevices: 11530,
    incidentCount: 31,
    coordinates: [28, 64],
  },
  {
    id: 'west-cloud',
    name: '西部云谷',
    riskScore: 56,
    onlineDevices: 18120,
    incidentCount: 25,
    coordinates: [18, 38],
  },
];

export const alertItems: AlertItem[] = [
  {
    id: 'A-10029',
    region: '北城枢纽',
    title: '边缘网关连续丢包',
    severity: 'critical',
    source: '网络遥测',
    time: '14:19:28',
  },
  {
    id: 'A-10031',
    region: '滨江港区',
    title: '无人巡检链路延迟升高',
    severity: 'high',
    source: '视频回传',
    time: '14:16:04',
  },
  {
    id: 'A-10035',
    region: '东部电网',
    title: '配电站温度异常波动',
    severity: 'high',
    source: 'IoT 传感',
    time: '14:12:47',
  },
  {
    id: 'A-10042',
    region: '中央核心区',
    title: '事件聚合队列短时拥塞',
    severity: 'medium',
    source: '消息总线',
    time: '14:07:33',
  },
  {
    id: 'A-10048',
    region: '空港片区',
    title: '存储副本同步延迟',
    severity: 'low',
    source: '存储集群',
    time: '13:58:21',
  },
];

export const resources: ResourceItem[] = [
  { key: 'cpu', label: 'CPU', value: 68, capacity: '384 Cores', status: 'stable' },
  { key: 'memory', label: '内存', value: 74, capacity: '2.8 TB', status: 'busy' },
  { key: 'network', label: '网络', value: 83, capacity: '920 Gbps', status: 'busy' },
  { key: 'storage', label: '存储', value: 61, capacity: '18.6 PB', status: 'stable' },
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'T-20041',
    time: '14:20',
    title: '跨域事件完成自动归并',
    region: '全域',
    type: 'dispatch',
  },
  {
    id: 'T-20040',
    time: '14:17',
    title: '北城枢纽触发一级巡检',
    region: '北城枢纽',
    type: 'detect',
  },
  {
    id: 'T-20038',
    time: '14:10',
    title: '滨江港区新增 128 路视频流',
    region: '滨江港区',
    type: 'ingest',
  },
  {
    id: 'T-20036',
    time: '13:54',
    title: '西部云谷链路质量恢复',
    region: '西部云谷',
    type: 'recover',
  },
];
