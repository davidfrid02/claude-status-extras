import { execFileSync } from 'node:child_process';
const RESET = '\x1b[0m';
const BLUE = '\x1b[94m';
const OSASCRIPT = `
use framework "EventKit"

set eventStore to current application's EKEventStore's alloc()'s init()
set grantedRef to reference
eventStore's requestFullAccessToEventsWithCompletion:(do shell script "")

set now to current application's NSDate's |date|()
set endOfDay to current application's NSCalendar's currentCalendar()'s startOfDayForDate:(now's dateByAddingTimeInterval:(24 * 60 * 60))

set predicate to eventStore's predicateForEventsWithStartDate:now endDate:endOfDay calendars:(missing value)
set matchingEvents to eventStore's eventsMatchingPredicate:predicate

set bestTitle to ""
set bestMinutes to 9999

repeat with evt in matchingEvents
  set cal to evt's calendar()
  set calType to cal's |type|() as integer
  -- 0=Local, 1=CalDAV, 2=Exchange are writable/personal
  -- 3=Subscription, 4=Birthday are read-only
  if calType < 3 and (cal's allowsContentModifications() as boolean) then
    set evtStart to evt's startDate()
    set diff to (evtStart's timeIntervalSinceDate:now) / 60
    if diff > -5 and diff < bestMinutes then
      set bestMinutes to diff as integer
      set bestTitle to evt's title() as text
    end if
  end if
end repeat

if bestTitle is "" then
  return "no_events"
else
  return bestTitle & "\\n" & (bestMinutes as text)
end if
`;
export function parseCalendarOutput(output) {
    const trimmed = output.trim();
    if (!trimmed || trimmed === 'no_events')
        return null;
    const lines = trimmed.split('\n');
    if (lines.length < 2)
        return null;
    const title = lines[0];
    const minutesUntil = parseInt(lines[1], 10);
    if (Number.isNaN(minutesUntil))
        return null;
    return { title, minutesUntil: Math.max(0, minutesUntil) };
}
function formatTime(minutesFromNow) {
    const target = new Date(Date.now() + minutesFromNow * 60_000);
    const hours = target.getHours();
    const mins = target.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const h = hours % 12 || 12;
    const m = mins.toString().padStart(2, '0');
    return `${h}:${m}${ampm}`;
}
export function formatCalendar(data) {
    let timeStr;
    if (data.minutesUntil <= 0) {
        timeStr = `${data.title} now`;
    }
    else if (data.minutesUntil < 60) {
        timeStr = `${data.title} in ${data.minutesUntil}m`;
    }
    else if (data.minutesUntil <= 180) {
        const hours = Math.round(data.minutesUntil / 60);
        timeStr = `${data.title} in ${hours}h`;
    }
    else {
        timeStr = `${data.title} at ${formatTime(data.minutesUntil)}`;
    }
    return `${BLUE}📅 ${timeStr}${RESET}`;
}
export function formatNoMeetings() {
    return `${BLUE}✓ Free rest of day${RESET}`;
}
export function fetchCalendarSync() {
    try {
        const stdout = execFileSync('osascript', ['-e', OSASCRIPT], {
            timeout: 5_000,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore'],
        });
        return parseCalendarOutput(stdout);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=calendar.js.map