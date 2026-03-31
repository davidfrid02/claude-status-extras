import { readFileSync, writeFileSync } from 'node:fs';
import type { SpotifyData, WeatherData, CalendarData, AlertData } from './types.js';

const CACHE_PATH = '/tmp/claude-status-extras-cache.json';

export interface CacheFile {
  spotify?: { data: SpotifyData | null; fetchedAt: number };
  weather?: { data: WeatherData | null; fetchedAt: number };
  calendar?: { data: CalendarData | null; fetchedAt: number };
  alert?: { data: AlertData | null; fetchedAt: number };
}

export function readCache(): CacheFile {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as CacheFile;
  } catch {
    return {};
  }
}

export function writeCache(cache: CacheFile): void {
  try {
    writeFileSync(CACHE_PATH, JSON.stringify(cache));
  } catch {
    // ignore write failures
  }
}
