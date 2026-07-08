import type { TimelineEvent } from '@/features/dashboard/types';
import { Panel } from '@/shared/ui/Panel/Panel';

import './EventTimeline.css';

type EventTimelineProps = {
  events: TimelineEvent[];
};

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <Panel title="最新采样动态" eyebrow="Timeline">
      <div className="event-timeline" aria-label="最新采样动态">
        {events.map((event) => (
          <article
            key={event.id}
            className={`event-timeline__item event-timeline__item--${event.type}`}
          >
            <time>{event.time}</time>
            <div>
              <h3>{event.title}</h3>
              <p>{event.region}</p>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
