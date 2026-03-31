import type { CalendarData } from '../types.js';
export declare function parseCalendarOutput(output: string): CalendarData | null;
export declare function formatCalendar(data: CalendarData): string;
export declare function formatNoMeetings(): string;
export declare function fetchCalendarSync(): CalendarData | null;
