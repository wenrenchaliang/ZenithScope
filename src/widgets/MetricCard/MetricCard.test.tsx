import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { MetricItem } from '@/features/dashboard/types';

import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('renders metric label, value and delta', () => {
    const metric = {
      key: 'visitsToday',
      label: '今日访问量',
      value: 128642,
      unit: '',
      delta: 4.8,
      tone: 'cyan',
    } satisfies MetricItem;

    render(<MetricCard metric={metric} />);

    expect(screen.getByText('今日访问量')).toBeInTheDocument();
    expect(screen.getByText('+4.8%')).toBeInTheDocument();
    expect(screen.getByText(/万/)).toBeInTheDocument();
  });
});
