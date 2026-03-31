import { execFileSync } from 'node:child_process';
import type { WeatherData } from '../types.js';

const RESET = '\x1b[0m';
const YELLOW = '\x1b[33m';

export function getLocaleUnitsParam(locale?: string): string {
  const loc = locale ?? Intl.DateTimeFormat().resolvedOptions().locale;
  return loc.includes('US') ? 'u' : 'm';
}

export function parseWeatherOutput(output: string): WeatherData | null {
  const trimmed = output.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('Unknown') || trimmed.startsWith('ERROR') || trimmed.length > 30) return null;
  return { display: trimmed };
}

export function formatWeather(data: WeatherData): string {
  return `${YELLOW}${data.display}${RESET}`;
}

export function fetchWeatherSync(): WeatherData | null {
  try {
    const units = getLocaleUnitsParam();
    const stdout = execFileSync('curl', ['-s', '--max-time', '3', `http://wttr.in/?format=%c%t&${units}`], {
      timeout: 5_000,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return parseWeatherOutput(stdout);
  } catch {
    return null;
  }
}
