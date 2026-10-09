import { LogLevel } from '@nestjs/common';

export interface AppConfig {
  port: number;
  environment: string;
  logLevel: string;
}

const LOG_LEVEL_HIERARCHY: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'];

export function resolveLogLevels(logLevel: string): LogLevel[] {
  const index = LOG_LEVEL_HIERARCHY.indexOf(logLevel as LogLevel);
  if (index === -1) {
    return LOG_LEVEL_HIERARCHY.slice(LOG_LEVEL_HIERARCHY.indexOf('log'));
  }

  return LOG_LEVEL_HIERARCHY.slice(index);
}

function parsePort(rawPort: string | undefined): number {
  if (rawPort === undefined || rawPort === '') {
    return 3000;
  }

  const parsed = Number(rawPort);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid PORT environment variable: "${rawPort}"`);
  }

  return parsed;
}

export default (): AppConfig => ({
  port: parsePort(process.env.PORT),
  environment: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'log',
});
