import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

import type { TrendPoint } from '@/features/dashboard/types';
import { BaseEChart } from '@/shared/chart/BaseEChart';
import { withChartDefaults } from '@/shared/chart/chartTheme';
import { Panel } from '@/shared/ui/Panel/Panel';

import './TrendChart.css';

type TrendChartProps = {
  trends: TrendPoint[];
};

export function TrendChart({ trends }: TrendChartProps) {
  const option = useMemo<EChartsOption>(
    () =>
      withChartDefaults({
        grid: { left: 36, right: 18, top: 24, bottom: 28 },
        tooltip: { trigger: 'axis' },
        legend: {
          top: 0,
          right: 0,
          textStyle: { color: '#9db3c8' },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: trends.map((point) => point.hour),
          axisLine: { lineStyle: { color: 'rgba(157, 179, 200, 0.35)' } },
          axisLabel: { color: '#9db3c8', interval: 3 },
        },
        yAxis: [
          {
            type: 'value',
            name: '事件',
            splitLine: { lineStyle: { color: 'rgba(157, 179, 200, 0.12)' } },
            axisLabel: { color: '#9db3c8' },
          },
          {
            type: 'value',
            name: '告警',
            splitLine: { show: false },
            axisLabel: { color: '#9db3c8' },
          },
        ],
        series: [
          {
            name: '事件量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: { color: 'rgba(52, 213, 255, 0.13)' },
            lineStyle: { width: 3, color: '#34d5ff' },
            data: trends.map((point) => point.events),
          },
          {
            name: '告警',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: 8,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: '#f6c95c',
            },
            data: trends.map((point) => point.alerts),
          },
        ],
      }),
    [trends],
  );

  return (
    <Panel title="近 24 小时事件趋势" eyebrow="Trend">
      <BaseEChart className="trend-chart" option={option} ariaLabel="近24小时事件趋势图" />
    </Panel>
  );
}
