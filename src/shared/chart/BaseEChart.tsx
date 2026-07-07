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
  const optionRef = useRef(option);

  useEffect(() => {
    optionRef.current = option;

    const container = containerRef.current;
    if (!container || !chartRef.current) {
      return;
    }

    const { width, height } = container.getBoundingClientRect();
    if (width > 0 && height > 0) {
      chartRef.current.setOption(option, true);
    }
  }, [option]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const ensureChart = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) {
        return;
      }

      if (!chartRef.current) {
        chartRef.current = echarts.init(container, undefined, {
          renderer: 'canvas',
        });
      }

      chartRef.current.resize();
      chartRef.current.setOption(optionRef.current, true);
    };

    const resizeObserver = new ResizeObserver(() => {
      ensureChart();
    });
    resizeObserver.observe(container);
    ensureChart();

    return () => {
      resizeObserver.disconnect();
      try {
        chartRef.current?.dispose();
      } catch {
        // ECharts can throw while disposing a zero-sized canvas during rapid viewport changes.
      }
      chartRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={className} role="img" aria-label={ariaLabel} />;
}
