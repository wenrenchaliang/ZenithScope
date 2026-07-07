import type { EChartsOption } from 'echarts';

export const chartPalette = ['#65f0ff', '#33d7ff', '#2f8dff', '#f7d27a', '#9ea7ff'];

export const baseChartTextStyle = {
  color: '#9fb7d4',
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

export function withChartDefaults(option: EChartsOption): EChartsOption {
  const { tooltip, ...restOption } = option;

  return {
    color: chartPalette,
    textStyle: baseChartTextStyle,
    animationDuration: 700,
    animationEasing: 'cubicOut',
    tooltip: {
      borderWidth: 1,
      borderColor: 'rgba(101, 240, 255, 0.34)',
      backgroundColor: 'rgba(5, 18, 38, 0.92)',
      textStyle: {
        color: '#eef8ff',
      },
      extraCssText: 'box-shadow: 0 0 22px rgba(51, 215, 255, 0.18); backdrop-filter: blur(10px);',
      ...(Array.isArray(tooltip) ? {} : tooltip),
    },
    ...restOption,
  };
}
