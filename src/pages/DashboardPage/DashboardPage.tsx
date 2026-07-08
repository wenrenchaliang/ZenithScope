import { AlertPanel } from '@/widgets/AlertPanel/AlertPanel';
import { EventTimeline } from '@/widgets/EventTimeline/EventTimeline';
import { HeaderBar } from '@/widgets/HeaderBar/HeaderBar';
import { MetricCard } from '@/widgets/MetricCard/MetricCard';
import { RankingBoard } from '@/widgets/RankingBoard/RankingBoard';
import { RegionMap } from '@/widgets/RegionMap/RegionMap';
import { ResourceGauge } from '@/widgets/ResourceGauge/ResourceGauge';
import { TrendChart } from '@/widgets/TrendChart/TrendChart';
import { useDashboardQueries } from '@/features/dashboard/model/useDashboardQueries';
import { useUiStore } from '@/shared/store/uiStore';

import './DashboardPage.css';

export function DashboardPage() {
  const refreshEnabled = useUiStore((state) => state.refreshEnabled);
  const { data, isError, isLoading } = useDashboardQueries(refreshEnabled);

  if (isError) {
    return (
      <main className="dashboard-page dashboard-page--center">
        <div className="dashboard-page__fallback">数据库 API 暂不可用，请确认 MySQL 与后端服务已启动</div>
      </main>
    );
  }

  if (isLoading || !data) {
    return (
      <main className="dashboard-page dashboard-page--center">
        <div className="dashboard-page__fallback">正在连接 ZenithScope 监控数据链路</div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-page__backdrop" />
      <HeaderBar overview={data.overview} />

      <section className="dashboard-page__metrics" aria-label="核心监控指标">
        {data.overview.metrics.map((metric) => (
          <MetricCard key={metric.key} metric={metric} />
        ))}
      </section>

      <section className="dashboard-page__monitor-grid" aria-label="主机监控工作台">
        <div className="dashboard-page__panel dashboard-page__panel--trend">
          <TrendChart trends={data.trends} />
        </div>

        <div className="dashboard-page__panel dashboard-page__panel--resources">
          <ResourceGauge resources={data.resources} />
        </div>

        <div className="dashboard-page__panel dashboard-page__panel--alerts">
          <AlertPanel alerts={data.alerts} />
        </div>

        <div className="dashboard-page__panel dashboard-page__panel--topology">
          <RegionMap regions={data.regions} />
        </div>

        <div className="dashboard-page__panel dashboard-page__panel--ranking">
          <RankingBoard regions={data.regions} />
        </div>

        <div className="dashboard-page__panel dashboard-page__panel--timeline">
          <EventTimeline events={data.timeline} />
        </div>
      </section>
    </main>
  );
}
