import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

import type { RegionRisk } from '@/features/dashboard/types';
import { BaseEChart } from '@/shared/chart/BaseEChart';
import { withChartDefaults } from '@/shared/chart/chartTheme';
import { Panel } from '@/shared/ui/Panel/Panel';

import './RegionMap.css';

type RegionMapProps = {
  regions: RegionRisk[];
};

export function RegionMap({ regions }: RegionMapProps) {
  const maxRisk = Math.max(...regions.map((region) => region.riskScore));
  const option = useMemo<EChartsOption>(
    () =>
      withChartDefaults({
        grid: { left: 16, right: 16, top: 18, bottom: 18 },
        tooltip: {
          trigger: 'item',
          formatter: (params: unknown) => {
            const data = (params as { data?: { name?: string; value?: unknown } }).data;
            if (!data || !Array.isArray(data.value)) {
              return '';
            }

            const value = data.value as [number, number, number, number];
            return `${data.name ?? '数据链路'}<br/>活跃指数：${value[2]}<br/>互动量：${value[3]}`;
          },
        },
        xAxis: {
          min: 0,
          max: 100,
          show: false,
          splitLine: { show: false },
        },
        yAxis: {
          min: 0,
          max: 80,
          show: false,
          splitLine: { show: false },
        },
        series: [
          {
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            zlevel: 1,
            effect: {
              show: true,
              period: 4,
              trailLength: 0.25,
              color: '#65f0ff',
              symbolSize: 4,
            },
            lineStyle: {
              color: 'rgba(101, 240, 255, 0.32)',
              width: 1,
              curveness: 0.18,
            },
            data: regions.map((region) => ({
              coords: [[50, 45], region.coordinates],
            })),
          },
          {
            name: '中枢节点',
            type: 'effectScatter',
            coordinateSystem: 'cartesian2d',
            zlevel: 2,
            rippleEffect: { brushType: 'stroke', scale: 3.5 },
            symbolSize: (value: unknown) => {
              const pointValue = value as [number, number, number, number];
              return 12 + (Number(pointValue[2]) / maxRisk) * 26;
            },
            itemStyle: {
              color: (params: unknown) => {
                const risk = Number((params as { value: number[] }).value[2]);
                if (risk >= 85) {
                  return '#ff6f8e';
                }
                if (risk >= 72) {
                  return '#f7d27a';
                }
                return '#65f7c7';
              },
              shadowBlur: 22,
              shadowColor: 'rgba(101, 240, 255, 0.5)',
            },
            label: {
              show: true,
              formatter: '{b}',
              position: 'right',
              color: '#f3fbff',
              fontWeight: 700,
              textShadowBlur: 8,
              textShadowColor: 'rgba(101, 240, 255, 0.35)',
            },
            data: regions.map((region) => ({
              name: region.name,
              value: [
                region.coordinates[0],
                region.coordinates[1],
                region.riskScore,
                region.incidentCount,
              ],
            })),
          },
        ],
      }),
    [maxRisk, regions],
  );

  const totalDevices = regions.reduce((sum, region) => sum + region.onlineDevices, 0);
  const totalIncidents = regions.reduce((sum, region) => sum + region.incidentCount, 0);

  return (
    <Panel title="天顶数据中枢" eyebrow="Data Hub" className="region-map-panel">
      <div className="region-map">
        <BaseEChart className="region-map__chart" option={option} ariaLabel="天顶数据中枢节点图" />
        <div className="region-map__summary" aria-label="天顶数据中枢摘要">
          <div>
            <span>访问总量</span>
            <strong>{totalDevices.toLocaleString('zh-CN')}</strong>
          </div>
          <div>
            <span>互动任务</span>
            <strong>{totalIncidents}</strong>
          </div>
          <div>
            <span>最高活跃</span>
            <strong>{maxRisk}</strong>
          </div>
        </div>
      </div>
    </Panel>
  );
}
