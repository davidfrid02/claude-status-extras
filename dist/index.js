import { readStdin } from './stdin.js';
import { fetchSpotifySync, formatSpotify } from './providers/spotify.js';
import { fetchWeatherSync, formatWeather } from './providers/weather.js';
import { fetchCalendarSync, formatCalendar, formatNoMeetings } from './providers/calendar.js';
import { buildLine } from './render.js';
import { readCache, writeCache } from './cache.js';
const SPOTIFY_TTL = 5_000; // 5 seconds
const WEATHER_TTL = 30 * 60_000; // 30 minutes
const CALENDAR_TTL = 3 * 60_000; // 3 minutes
function isStale(fetchedAt, ttl) {
    if (!fetchedAt)
        return true;
    return Date.now() - fetchedAt > ttl;
}
async function main() {
    try {
        const stdin = await readStdin();
        if (!stdin)
            return;
        const cache = readCache();
        const now = Date.now();
        // Spotify: fetch if stale (5s TTL)
        if (isStale(cache.spotify?.fetchedAt, SPOTIFY_TTL)) {
            cache.spotify = { data: fetchSpotifySync(), fetchedAt: now };
        }
        // Weather: fetch if stale (30min TTL) — uses curl, so only runs rarely
        if (isStale(cache.weather?.fetchedAt, WEATHER_TTL)) {
            cache.weather = { data: fetchWeatherSync(), fetchedAt: now };
        }
        // Calendar: fetch if stale (3min TTL)
        if (isStale(cache.calendar?.fetchedAt, CALENDAR_TTL)) {
            cache.calendar = { data: fetchCalendarSync(), fetchedAt: now };
        }
        writeCache(cache);
        // Format outputs
        const spotifyStr = cache.spotify?.data ? formatSpotify(cache.spotify.data) : null;
        const weatherStr = cache.weather?.data ? formatWeather(cache.weather.data) : null;
        let calendarStr = null;
        if (cache.calendar?.data) {
            calendarStr = formatCalendar(cache.calendar.data);
        }
        else if (cache.calendar?.fetchedAt) {
            calendarStr = formatNoMeetings();
        }
        const line = buildLine(calendarStr, weatherStr, spotifyStr);
        if (line) {
            console.log(line);
        }
    }
    catch {
        // Silent failure — never pollute statusline with errors
    }
}
main();
//# sourceMappingURL=index.js.map