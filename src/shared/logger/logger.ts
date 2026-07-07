type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = import.meta.env.DEV;

function shouldLog(level: LogLevel) {
  if (isDev) {
    return true;
  }

  return level === 'warn' || level === 'error';
}

function sendRemoteLog(level: LogLevel, message: string, context: unknown[]) {
  void level;
  void message;
  void context;
  // Reserved for future remote log transport.
}

export const logger = {
  debug(message: string, ...context: unknown[]) {
    if (shouldLog('debug')) {
      console.debug(`[ZenithScope] ${message}`, ...context);
    }
    sendRemoteLog('debug', message, context);
  },
  info(message: string, ...context: unknown[]) {
    if (shouldLog('info')) {
      console.info(`[ZenithScope] ${message}`, ...context);
    }
    sendRemoteLog('info', message, context);
  },
  warn(message: string, ...context: unknown[]) {
    if (shouldLog('warn')) {
      console.warn(`[ZenithScope] ${message}`, ...context);
    }
    sendRemoteLog('warn', message, context);
  },
  error(message: string, ...context: unknown[]) {
    if (shouldLog('error')) {
      console.error(`[ZenithScope] ${message}`, ...context);
    }
    sendRemoteLog('error', message, context);
  },
};
