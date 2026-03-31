import { get } from 'node:http';
import type { WeatherData, ProviderResult } from '../types.js';

const RESET = '\x1b[0m';
const YELLOW = '\x1b[33m';

const CACHE_TTL = 30 * 60_000; // 30 minutes
let cache: ProviderResult<WeatherData> = { data: null, fetchedAt: 0 };
let fetching = false;

export function getLocaleUnitsParam(locale?: string): string {
  const loc = locale ?? Intl.DateTimeFormat().resolvedOptions().locale;
  return loc.includes('US') ? 'u' : 'm';
}

export function parseWeatherOutput(output: string): WeatherData | null {
  const trimmed = output.trim();
  if (!trimmed) return null;
  // wttr.in returns "Unknown location" or similar on errors
  if (trimmed.startsWith('Unknown') || trimmed.startsWith('ERROR') || trimmed.length > 30) return null;
  return { display: trimmed };
}

export function formatWeather(data: WeatherData): string {
  return `${YELLOW}${data.display}${RESET}`;
}

function fetchWeather(): void {
  if (fetching) return;
  fetching = true;
  const units = getLocaleUnitsParam();
  const url = `http://wttr.in/?format=%c%t&${units}`;
  const req = get(url, { timeout: 5_000 }, (res) => {
    const chunks: string[] = [];
    res.setEncoding('utf8');
    res.on('data', (chunk: string) => chunks.push(chunk));
    res.on('end', () => {
      fetching = false;
      cache = { data: parseWeatherOutput(chunks.join('')), fetchedAt: Date.now() };
    });
  });
  req.on('error', () => {
    fetching = false;
    // Keep stale cache on failure
  });
  req.on('timeout', () => {
    req.destroy();
    fetching = false;
  });
}

export function getWeather(): WeatherData | null {
  const elapsed = Date.now() - cache.fetchedAt;
  if (elapsed > CACHE_TTL) {
    fetchWeather();
  }
  return cache.data;
}
