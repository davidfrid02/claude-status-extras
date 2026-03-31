import { readStdin } from './stdin.js';
import { fetchSpotifySync, formatSpotify } from './providers/spotify.js';
import { fetchWeatherSync, formatWeather } from './providers/weather.js';
import { fetchCalendarSync, formatCalendar, formatNoMeetings } from './providers/calendar.js';
import { fetchAlertSync, formatAlert, loadUserCity } from './providers/alert.js';
import { buildLine, buildOutput } from './render.js';
import { readCache, writeCache } from './cache.js';

const SPOTIFY_TTL = 5_000;
const WEATHER_TTL = 30 * 60_000;
const CALENDAR_TTL = 3 * 60_000;
const ALERT_TTL = 30_000; // 30 seconds

function isStale(fetchedAt: number | undefined, ttl: number): boolean {
  if (!fetchedAt) return true;
  return Date.now() - fetchedAt > ttl;
}

async function main(): Promise<void> {
  try {
    const stdin = await readStdin();
    if (!stdin) return;

    const cache = readCache();
    const now = Date.now();

    // Alert: fetch if stale (30s TTL) — only if user configured a city
    const city = loadUserCity();
    if (city && isStale(cache.alert?.fetchedAt, ALERT_TTL)) {
      cache.alert = { data: fetchAlertSync(city), fetchedAt: now };
    }

    if (isStale(cache.spotify?.fetchedAt, SPOTIFY_TTL)) {
      cache.spotify = { data: fetchSpotifySync(), fetchedAt: now };
    }

    if (isStale(cache.weather?.fetchedAt, WEATHER_TTL)) {
      cache.weather = { data: fetchWeatherSync(), fetchedAt: now };
    }

    if (isStale(cache.calendar?.fetchedAt, CALENDAR_TTL)) {
      cache.calendar = { data: fetchCalendarSync(), fetchedAt: now };
    }

    writeCache(cache);

    const alertStr = cache.alert?.data?.active ? formatAlert(cache.alert.data) : null;
    const spotifyStr = cache.spotify?.data ? formatSpotify(cache.spotify.data) : null;
    const weatherStr = cache.weather?.data ? formatWeather(cache.weather.data) : null;

    let calendarStr: string | null = null;
    if (cache.calendar?.data) {
      calendarStr = formatCalendar(cache.calendar.data);
    } else if (cache.calendar?.fetchedAt) {
      calendarStr = formatNoMeetings();
    }

    const statusLine = buildLine(calendarStr, weatherStr, spotifyStr);
    const output = buildOutput(alertStr, statusLine);
    if (output) {
      console.log(output);
    }
  } catch {
    // Silent failure
  }
}

main();
