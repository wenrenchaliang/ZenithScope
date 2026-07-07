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
        <div className="dashboard-page__fallback">数据通道异常，正在等待恢复</div>
      </main>
    );
  }

  if (isLoading || !data) {
    return (
      <main className="dashboard-page dashboard-page--center">
        <div className="dashboard-page__fallback">ZenithScope 数据链路建立中</div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-page__backdrop" />
      <HeaderBar overview={data.overview} />

      <section className="dashboard-page__metrics" aria-label="核心指标区域">
        {data.overview.metrics.map((metric) => (
          <MetricCard key={metric.key} metric={metric} />
        ))}
      </section>

      <section className="dashboard-page__grid">
        <div className="dashboard-page__column dashboard-page__column--left">
          <TrendChart trends={data.trends} />
          <RankingBoard regions={data.regions} />
        </div>

        <div className="dashboard-page__column dashboard-page__column--center">
          <RegionMap regions={data.regions} />
          <EventTimeline events={data.timeline} />
        </div>

        <div className="dashboard-page__column dashboard-page__column--right">
          <AlertPanel alerts={data.alerts} />
          <ResourceGauge resources={data.resources} />
        </div>
      </section>
    </main>
  );
}
