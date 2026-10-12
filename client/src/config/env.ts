export interface AppConfig {
  apiBaseUrl: string;
}

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export default (): AppConfig => ({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
});
