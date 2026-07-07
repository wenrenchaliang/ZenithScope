import type { ReactNode } from 'react';

import './Panel.css';

type PanelProps = {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, eyebrow, action, children, className = '' }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel__header">
        <div>
          {eyebrow ? <span className="panel__eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
        </div>
        {action ? <div className="panel__action">{action}</div> : null}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}
