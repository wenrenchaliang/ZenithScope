import { query } from './db.js';

function round(value, digits = 1) {
  const number = Number(value ?? 0);
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}

function metricStatus(value) {
  if (value >= 86) return 'pressure';
  if (value >= 72) return 'busy';
  return 'stable';
}

function statusFromScore(score) {
  if (score >= 85) return 'critical';
  if (score >= 70) return 'warning';
  return 'nominal';
}

function severityFromScore(score) {
  if (score >= 90) return 'critical';
  if (score >= 80) return 'high';
  if (score >= 65) return 'medium';
  return 'low';
}

async function getLatestDate() {
  const [row] = await query(
    "SELECT MAX(collected_date) AS latestDate FROM tsar_metrics WHERE metric_mod = 'cpu_usage'",
  );
  return row?.latestDate;
}

async function getOverview(latestDate) {
  const [row] = await query(
    `
      SELECT
        (SELECT COUNT(*) FROM hosts) AS hostCount,
        (SELECT COUNT(*) FROM tsar_metrics WHERE collected_date = ?) AS sampleCount,
        (SELECT AVG(avg_value) FROM daily_metric_summary WHERE collected_date = ? AND metric_mod = 'cpu_usage') AS cpuUsage,
        (SELECT AVG(avg_value) FROM daily_metric_summary WHERE collected_date = ? AND metric_mod = 'net_in') AS netIn,
        (
          SELECT COUNT(*)
          FROM daily_metric_summary
          WHERE collected_date = ?
            AND (
              (metric_mod = 'cpu_usage' AND max_value >= 72)
              OR (tag = 'disk_util_percent' AND max_value >= 85)
              OR (metric_mod = 'cpu_wait' AND max_value >= 45)
            )
        ) AS activeAlerts,
        (SELECT MAX(collected_at) FROM tsar_metrics WHERE collected_date = ?) AS updatedAt
    `,
    [latestDate, latestDate, latestDate, latestDate, latestDate],
  );

  const cpuUsage = round(row.cpuUsage);
  const activeAlerts = Number(row.activeAlerts ?? 0);
  const statusScore = Math.max(cpuUsage, activeAlerts >= 10 ? 75 : activeAlerts >= 5 ? 68 : 50);

  return {
    status: statusFromScore(statusScore),
    updatedAt: row.updatedAt ? `${row.updatedAt}+08:00` : new Date().toISOString(),
    metrics: [
      {
        key: 'devicesOnline',
        label: '监控主机',
        value: Number(row.hostCount ?? 0),
        unit: '台',
        delta: 0,
        tone: 'cyan',
      },
      {
        key: 'eventsToday',
        label: '最新日采样',
        value: Number(row.sampleCount ?? 0),
        unit: '条',
        delta: 0,
        tone: 'green',
      },
      {
        key: 'activeAlerts',
        label: '高风险指标',
        value: activeAlerts,
        unit: '项',
        delta: 0,
        tone: activeAlerts > 0 ? 'rose' : 'green',
      },
      {
        key: 'throughput',
        label: '平均入站流量',
        value: round(row.netIn),
        unit: 'MB/s',
        delta: 0,
        tone: 'violet',
      },
    ],
  };
}

async function getTrends(latestDate) {
  const rows = await query(
    `
      SELECT
        p.hour_label AS hour,
        p.cpu_usage AS events,
        COALESCE(d.disk_util, 0) AS alerts
      FROM (
        SELECT
          HOUR(collected_at) AS hour_index,
          DATE_FORMAT(MIN(collected_at), '%H:00') AS hour_label,
          ROUND(AVG(value), 1) AS cpu_usage
        FROM tsar_metrics
        WHERE collected_date = ?
          AND metric_mod = 'cpu_usage'
        GROUP BY HOUR(collected_at)
      ) p
      LEFT JOIN (
        SELECT
          HOUR(collected_at) AS hour_index,
          ROUND(AVG(value), 1) AS disk_util
        FROM tsar_metrics
        WHERE collected_date = ?
          AND tag = 'disk_util_percent'
        GROUP BY HOUR(collected_at)
      ) d ON d.hour_index = p.hour_index
      ORDER BY p.hour_index
    `,
    [latestDate, latestDate],
  );

  return rows.map((row) => ({
    hour: row.hour,
    events: round(row.events),
    alerts: round(row.alerts),
  }));
}

async function getHostRanking(latestDate) {
  const rows = await query(
    `
      SELECT
        h.hostid AS id,
        h.hostname AS name,
        h.location1,
        h.location2,
        COALESCE(cpu.avg_value, 0) AS cpuUsage,
        COALESCE(cpu.max_value, 0) AS cpuPeak,
        COALESCE(disk.avg_disk_util, 0) AS diskUtil,
        COALESCE(load1.avg_value, 0) AS loadValue,
        COALESCE(samples.sample_count, 0) AS sampleCount
      FROM hosts h
      LEFT JOIN daily_metric_summary cpu
        ON cpu.hostid = h.hostid AND cpu.collected_date = ? AND cpu.metric_mod = 'cpu_usage'
      LEFT JOIN daily_metric_summary load1
        ON load1.hostid = h.hostid AND load1.collected_date = ? AND load1.metric_mod = 'load1'
      LEFT JOIN (
        SELECT hostid, AVG(avg_value) AS avg_disk_util
        FROM daily_metric_summary
        WHERE collected_date = ? AND tag = 'disk_util_percent'
        GROUP BY hostid
      ) disk ON disk.hostid = h.hostid
      LEFT JOIN (
        SELECT hostid, SUM(sample_count) AS sample_count
        FROM daily_metric_summary
        WHERE collected_date = ?
        GROUP BY hostid
      ) samples ON samples.hostid = h.hostid
      ORDER BY (COALESCE(cpu.avg_value, 0) * 0.45 + COALESCE(disk.avg_disk_util, 0) * 0.45 + COALESCE(load1.avg_value, 0) * 0.35) DESC
      LIMIT 6
    `,
    [latestDate, latestDate, latestDate, latestDate],
  );

  const coordinates = [
    [34, 58],
    [66, 55],
    [52, 44],
    [75, 31],
    [28, 30],
    [48, 23],
  ];

  return rows.map((row, index) => {
    const riskScore = Math.min(
      100,
      Math.round(Number(row.cpuUsage) * 0.55 + Number(row.diskUtil) * 0.35 + Number(row.loadValue)),
    );

    return {
      id: row.id,
      name: `${row.name}`,
      riskScore,
      onlineDevices: Number(row.sampleCount),
      incidentCount: round(row.cpuPeak),
      coordinates: coordinates[index] ?? [50, 45],
      location: `${row.location1} ${row.location2}`,
    };
  });
}

async function getAlerts(latestDate) {
  const rows = await query(
    `
      SELECT
        CONCAT(s.hostid, '-', s.metric_mod) AS id,
        h.hostname,
        h.location1,
        h.location2,
        s.metric_mod AS metricMod,
        s.tag,
        s.max_value,
        md.description,
        md.unit
      FROM daily_metric_summary s
      JOIN hosts h ON h.hostid = s.hostid
      JOIN metric_defs md ON md.metric_mod = s.metric_mod
      WHERE s.collected_date = ?
        AND (
          s.metric_mod IN ('cpu_usage', 'cpu_wait', 'load1')
          OR s.tag IN ('disk_util_percent', 'disk_latency_ms')
        )
      ORDER BY
        CASE
          WHEN s.tag = 'disk_util_percent' THEN s.max_value
          WHEN s.metric_mod = 'cpu_usage' THEN s.max_value
          WHEN s.metric_mod = 'cpu_wait' THEN s.max_value * 1.7
          WHEN s.tag = 'disk_latency_ms' THEN s.max_value * 2.5
          ELSE s.max_value
        END DESC
      LIMIT 5
    `,
    [latestDate],
  );

  return rows.map((row) => {
    const score =
      row.tag === 'disk_latency_ms' ? Number(row.max_value) * 3 : Number(row.max_value);
    return {
      id: row.id,
      region: `${row.location1} ${row.location2}`,
      title: `${row.hostname} ${row.description}峰值 ${round(row.max_value)}${row.unit}`,
      severity: severityFromScore(score),
      source: row.metricMod,
      time: latestDate,
    };
  });
}

async function getResources(latestDate) {
  const [row] = await query(
    `
      SELECT
        (SELECT AVG(avg_value) FROM daily_metric_summary WHERE collected_date = ? AND metric_mod = 'cpu_usage') AS cpu,
        (
          SELECT used.avg_value / NULLIF(used.avg_value + free.avg_value, 0) * 100
          FROM (
            SELECT AVG(avg_value) AS avg_value FROM daily_metric_summary WHERE collected_date = ? AND metric_mod = 'mem_used'
          ) used
          CROSS JOIN (
            SELECT AVG(avg_value) AS avg_value FROM daily_metric_summary WHERE collected_date = ? AND metric_mod = 'mem_free'
          ) free
        ) AS memory,
        (
          SELECT (AVG(CASE WHEN metric_mod = 'net_in' THEN avg_value END) + AVG(CASE WHEN metric_mod = 'net_out' THEN avg_value END)) / 20
          FROM daily_metric_summary
          WHERE collected_date = ? AND metric_mod IN ('net_in', 'net_out')
        ) AS network,
        (SELECT AVG(avg_value) FROM daily_metric_summary WHERE collected_date = ? AND tag = 'disk_util_percent') AS storage
    `,
    [latestDate, latestDate, latestDate, latestDate, latestDate],
  );

  const resources = [
    { key: 'cpu', label: 'CPU', value: round(row.cpu), capacity: '平均使用率' },
    { key: 'memory', label: '内存', value: round(row.memory), capacity: 'used / used+free' },
    { key: 'network', label: '网络', value: round(row.network), capacity: '入站+出站折算' },
    { key: 'storage', label: '磁盘', value: round(row.storage), capacity: '磁盘利用率均值' },
  ];

  return resources.map((resource) => ({
    ...resource,
    value: Math.min(100, resource.value),
    status: metricStatus(resource.value),
  }));
}

async function getTimeline(latestDate) {
  const rows = await query(
    `
      SELECT
        m.id,
        DATE_FORMAT(m.collected_at, '%Y-%m-%d %H:%i:%s') AS collectedAt,
        DATE_FORMAT(m.collected_at, '%H:%i') AS time,
        h.hostname,
        h.location1,
        h.location2,
        m.metric_mod AS metricMod,
        m.value,
        md.description,
        md.unit,
        m.tag
      FROM tsar_metrics m
      JOIN hosts h ON h.hostid = m.hostid
      JOIN metric_defs md ON md.metric_mod = m.metric_mod
      WHERE m.collected_date = ?
        AND (m.metric_mod IN ('cpu_usage', 'net_in', 'mem_used') OR m.tag IN ('disk_util_percent', 'disk_latency_ms'))
      ORDER BY m.collected_at DESC, m.value DESC
      LIMIT 6
    `,
    [latestDate],
  );

  return rows.map((row) => ({
    id: `T-${row.id}`,
    time: row.time,
    title: `${row.hostname} ${row.description} ${round(row.value)}${row.unit}`,
    region: `${row.location1} ${row.location2}`,
    type:
      row.tag === 'disk_latency_ms'
        ? 'detect'
        : row.metricMod === 'net_in'
          ? 'ingest'
          : row.metricMod === 'cpu_usage'
            ? 'dispatch'
            : 'recover',
  }));
}

export async function getDashboardData() {
  const latestDate = await getLatestDate();

  if (!latestDate) {
    throw new Error('No monitor data has been imported');
  }

  const [overview, trends, regions, alerts, resources, timeline] = await Promise.all([
    getOverview(latestDate),
    getTrends(latestDate),
    getHostRanking(latestDate),
    getAlerts(latestDate),
    getResources(latestDate),
    getTimeline(latestDate),
  ]);

  return {
    overview,
    trends,
    regions,
    alerts,
    resources,
    timeline,
  };
}
