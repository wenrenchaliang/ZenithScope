import type { AlertItem } from '@/features/dashboard/types';
import { sortAlertsBySeverity } from '@/features/dashboard/model/adapters';
import { Panel } from '@/shared/ui/Panel/Panel';

import './AlertPanel.css';

type AlertPanelProps = {
  alerts: AlertItem[];
};

const severityLabel: Record<AlertItem['severity'], string> = {
  critical: '紧急',
  high: '高危',
  medium: '中危',
  low: '低危',
};

export function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <Panel title="实时告警" eyebrow="Alerts" action={<span>{alerts.length} 条</span>}>
      <div className="alert-panel" aria-label="实时告警列表">
        {sortAlertsBySeverity(alerts).map((alert) => (
          <article
            key={alert.id}
            className={`alert-panel__item alert-panel__item--${alert.severity}`}
          >
            <div className="alert-panel__top">
              <span>{alert.time}</span>
              <strong>{severityLabel[alert.severity]}</strong>
            </div>
            <h3>{alert.title}</h3>
            <p>
              {alert.region} · {alert.source}
            </p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
