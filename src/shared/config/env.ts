export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  enableMocking: import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false',
} as const;
