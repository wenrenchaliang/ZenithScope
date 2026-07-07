import type { EChartsOption } from 'echarts';

export const chartPalette = ['#34d5ff', '#4ade80', '#f6c95c', '#ff667c', '#a78bfa'];

export const baseChartTextStyle = {
  color: '#aabdd2',
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

export function withChartDefaults(option: EChartsOption): EChartsOption {
  return {
    color: chartPalette,
    textStyle: baseChartTextStyle,
    animationDuration: 700,
    animationEasing: 'cubicOut',
    ...option,
  };
}
