const DEFAULT_API_BASE_URL = 'http://localhost:8080';

const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL =
  configuredApiBase && configuredApiBase.length > 0 ? configuredApiBase.replace(/\/$/, '') : DEFAULT_API_BASE_URL;

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};