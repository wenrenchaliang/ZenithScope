import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import { AppProviders } from './app/providers';
import './app/styles/global.css';
import { env } from './shared/config/env';
import { logger } from './shared/logger/logger';

const rootElement = document.getElementById('root');

async function enableMocking() {
  if (!env.enableMocking) {
    return;
  }

  const { worker } = await import('./shared/mock/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
  logger.info('MSW mock API started');
}

if (!rootElement) {
  throw new Error('Root element #root was not found');
}

enableMocking()
  .catch((error: unknown) => {
    logger.error('Failed to start mock API', error);
  })
  .finally(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </StrictMode>,
    );
  });
