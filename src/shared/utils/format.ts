export function formatCompactNumber(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatThroughput(value: number) {
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)} TB/s`;
  }

  return `${value.toFixed(1)} GB/s`;
}
