import { env } from '@/shared/config/env';
import { logger } from '@/shared/logger/logger';

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  const payload: unknown = contentType?.includes('application/json')
    ? ((await response.json()) as unknown)
    : null;

  if (!response.ok) {
    logger.warn('HTTP request failed', { path, status: response.status, payload });
    throw new HttpError(`Request failed: ${response.status}`, response.status, payload);
  }

  return payload as T;
}

export const httpClient = {
  get<T>(path: string, options?: RequestOptions) {
    return request<T>(path, { ...options, method: 'GET' });
  },
};
