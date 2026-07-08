export const env = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.DEV && import.meta.env.MODE !== 'test' ? 'http://127.0.0.1:3001' : ''),
  enableMocking: import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true',
} as const;
