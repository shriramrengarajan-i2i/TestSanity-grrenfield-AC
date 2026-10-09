export interface AppConfig {
  port: number;
  environment: string;
  logLevel: string;
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
