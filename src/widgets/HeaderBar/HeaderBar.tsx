import { useEffect, useState } from 'react';

import type { DashboardOverview } from '@/features/dashboard/types';
import { useUiStore } from '@/shared/store/uiStore';
import { formatClock, formatDateLine } from '@/shared/utils/time';

import './HeaderBar.css';

type HeaderBarProps = {
  overview: DashboardOverview;
};

const statusCopy: Record<DashboardOverview['status'], string> = {
  nominal: '运行稳定',
  warning: '重点监测',
  critical: '紧急响应',
};

export function HeaderBar({ overview }: HeaderBarProps) {
  const [now, setNow] = useState(() => new Date());
  const refreshEnabled = useUiStore((state) => state.refreshEnabled);
  const toggleRefresh = useUiStore((state) => state.toggleRefresh);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="header-bar">
      <div className="header-bar__status">
        <span className={`header-bar__status-dot header-bar__status-dot--${overview.status}`} />
        <span>{statusCopy[overview.status]}</span>
      </div>

      <div className="header-bar__brand">
        <span className="header-bar__brand-mark">ZS</span>
        <div>
          <h1>ZenithScope 天顶之眼</h1>
          <p>教学数据中心 · 实时可视化演示</p>
        </div>
      </div>

      <div className="header-bar__right">
        <div className="header-bar__time">
          <strong>{formatClock(now)}</strong>
          <span>{formatDateLine(now)}</span>
        </div>
        <button
          type="button"
          className={`header-bar__toggle ${refreshEnabled ? 'is-active' : ''}`}
          aria-pressed={refreshEnabled}
          onClick={toggleRefresh}
        >
          {refreshEnabled ? '自动刷新' : '暂停刷新'}
        </button>
      </div>
    </header>
  );
}
