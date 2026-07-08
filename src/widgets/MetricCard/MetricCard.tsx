import type { MetricItem } from '@/features/dashboard/types';
import { formatCompactNumber, formatThroughput } from '@/shared/utils/format';

import './MetricCard.css';

type MetricCardProps = {
  metric: MetricItem;
};

function getMetricValue(metric: MetricItem) {
  if (metric.key === 'throughput' && metric.unit === 'GB/s') {
    return formatThroughput(metric.value);
  }

  return `${formatCompactNumber(metric.value)}${metric.unit}`;
}

export function MetricCard({ metric }: MetricCardProps) {
  const deltaText = `${metric.delta > 0 ? '+' : ''}${metric.delta.toFixed(1)}%`;

  return (
    <article className={`metric-card metric-card--${metric.tone}`}>
      <span className="metric-card__label">{metric.label}</span>
      <strong className="metric-card__value">{getMetricValue(metric)}</strong>
      <div className="metric-card__footer">
        <span className={metric.delta >= 0 ? 'metric-card__delta' : 'metric-card__delta is-down'}>
          {deltaText}
        </span>
        <span>最新采集日</span>
      </div>
    </article>
  );
}
