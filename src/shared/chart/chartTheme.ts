import type { EChartsOption } from 'echarts';

export const chartPalette = ['#60A5FA', '#93C5FD', '#22D3EE', '#818CF8', '#D6B35A', '#F87171'];

export const baseChartTextStyle = {
  color: '#B6C7DD',
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
      borderColor: 'rgba(147, 197, 253, 0.18)',
      backgroundColor: 'rgba(8, 24, 44, 0.9)',
      textStyle: {
        color: '#F8FBFF',
      },
      extraCssText:
        'box-shadow: 0 14px 34px rgba(2, 8, 23, 0.36); backdrop-filter: blur(12px); border-radius: 8px;',
      ...(Array.isArray(tooltip) ? {} : tooltip),
    },
    ...restOption,
  };
}
