import type { ResourceItem } from '@/features/dashboard/types';
import { getResourceTone } from '@/features/dashboard/model/adapters';
import { Panel } from '@/shared/ui/Panel/Panel';
import { formatPercent } from '@/shared/utils/format';

import './ResourceGauge.css';

type ResourceGaugeProps = {
  resources: ResourceItem[];
};

export function ResourceGauge({ resources }: ResourceGaugeProps) {
  return (
    <Panel title="资源使用概览" eyebrow="Resources">
      <div className="resource-gauge" aria-label="资源使用概览">
        {resources.map((resource) => {
          const tone = getResourceTone(resource);

          return (
            <article
              key={resource.key}
              className={`resource-gauge__item resource-gauge__item--${tone}`}
            >
              <div className="resource-gauge__head">
                <strong>{resource.label}</strong>
                <span>{resource.capacity}</span>
              </div>
              <div
                className="resource-gauge__meter"
                aria-label={`${resource.label} ${formatPercent(resource.value)}`}
              >
                <span style={{ width: `${resource.value}%` }} />
              </div>
              <div className="resource-gauge__value">{formatPercent(resource.value)}</div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
