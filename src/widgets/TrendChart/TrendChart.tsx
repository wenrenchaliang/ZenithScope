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
        grid: { left: 38, right: 28, top: 46, bottom: 26 },
        tooltip: { trigger: 'axis' },
        legend: {
          top: 0,
          left: 'center',
          itemGap: 18,
          itemWidth: 18,
          itemHeight: 8,
          textStyle: { color: '#B6C7DD', padding: [0, 0, 0, 4] },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: trends.map((point) => point.hour),
          axisLine: { lineStyle: { color: 'rgba(147, 197, 253, 0.18)' } },
          axisTick: { show: false },
          axisLabel: { color: '#B6C7DD', interval: 3 },
        },
        yAxis: [
          {
            type: 'value',
            name: '访问',
            nameGap: 10,
            nameTextStyle: { color: '#B6C7DD', align: 'left', padding: [0, 0, 0, -6] },
            splitLine: { lineStyle: { color: 'rgba(147, 197, 253, 0.1)' } },
            axisLabel: { color: '#B6C7DD' },
          },
          {
            type: 'value',
            name: '任务',
            nameGap: 10,
            nameTextStyle: { color: '#B6C7DD', align: 'right', padding: [0, -6, 0, 0] },
            splitLine: { show: false },
            axisLabel: { color: '#B6C7DD' },
          },
        ],
        series: [
          {
            name: '访问量',
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
                  { offset: 0, color: 'rgba(96, 165, 250, 0.22)' },
                  { offset: 1, color: 'rgba(147, 197, 253, 0.02)' },
                ],
              },
            },
            lineStyle: {
              width: 2,
              color: '#60A5FA',
            },
            itemStyle: { color: '#60A5FA' },
            data: trends.map((point) => point.events),
          },
          {
            name: '任务',
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
                  { offset: 0, color: '#D6B35A' },
                  { offset: 1, color: 'rgba(214, 179, 90, 0.18)' },
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
    <Panel title="实时访问与任务趋势" eyebrow="Trend">
      <BaseEChart className="trend-chart" option={option} ariaLabel="实时访问与任务趋势图" />
    </Panel>
  );
}
