import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';
import { useEffect, useRef } from 'react';

type BaseEChartProps = {
  option: EChartsOption;
  className?: string;
  ariaLabel: string;
};

export function BaseEChart({ option, className, ariaLabel }: BaseEChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    chartRef.current = echarts.init(containerRef.current, undefined, {
      renderer: 'canvas',
    });

    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return <div ref={containerRef} className={className} role="img" aria-label={ariaLabel} />;
}
