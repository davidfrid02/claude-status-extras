import { readStdin } from './stdin.js';
import { getSpotify, formatSpotify } from './providers/spotify.js';
import { getWeather, formatWeather } from './providers/weather.js';
import { getCalendar, formatCalendar, formatNoMeetings, hasCalendarData } from './providers/calendar.js';
import { buildLine } from './render.js';

async function main(): Promise<void> {
  try {
    const stdin = await readStdin();
    if (!stdin) return;

    const spotifyData = getSpotify();
    const weatherData = getWeather();
    const calendarData = getCalendar();

    const spotifyStr = spotifyData ? formatSpotify(spotifyData) : null;
    const weatherStr = weatherData ? formatWeather(weatherData) : null;

    let calendarStr: string | null = null;
    if (calendarData) {
      calendarStr = formatCalendar(calendarData);
    } else if (hasCalendarData()) {
      // We've fetched before but there are no events
      calendarStr = formatNoMeetings();
    }

    const line = buildLine(calendarStr, weatherStr, spotifyStr);
    if (line) {
      console.log(line);
    }
  } catch {
    // Silent failure — never pollute statusline with errors
  }
}

main();
