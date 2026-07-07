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
        grid: { left: 38, right: 18, top: 30, bottom: 26 },
        tooltip: { trigger: 'axis' },
        legend: {
          top: 0,
          right: 0,
          textStyle: { color: '#9fb7d4' },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: trends.map((point) => point.hour),
          axisLine: { lineStyle: { color: 'rgba(101, 240, 255, 0.24)' } },
          axisTick: { show: false },
          axisLabel: { color: '#8fa8c5', interval: 3 },
        },
        yAxis: [
          {
            type: 'value',
            name: '事件',
            nameTextStyle: { color: '#8fa8c5' },
            splitLine: { lineStyle: { color: 'rgba(101, 240, 255, 0.1)' } },
            axisLabel: { color: '#8fa8c5' },
          },
          {
            type: 'value',
            name: '告警',
            nameTextStyle: { color: '#8fa8c5' },
            splitLine: { show: false },
            axisLabel: { color: '#8fa8c5' },
          },
        ],
        series: [
          {
            name: '事件量',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(101, 240, 255, 0.28)' },
                  { offset: 1, color: 'rgba(47, 141, 255, 0.02)' },
                ],
              },
            },
            lineStyle: {
              width: 3,
              color: '#65f0ff',
              shadowBlur: 12,
              shadowColor: 'rgba(101, 240, 255, 0.42)',
            },
            itemStyle: { color: '#65f0ff' },
            data: trends.map((point) => point.events),
          },
          {
            name: '告警',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: 8,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#f7d27a' },
                  { offset: 1, color: 'rgba(247, 210, 122, 0.18)' },
                ],
              },
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
