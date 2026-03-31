import type { SpotifyData, WeatherData, CalendarData, AlertData } from './types.js';
export interface CacheFile {
    spotify?: {
        data: SpotifyData | null;
        fetchedAt: number;
    };
    weather?: {
        data: WeatherData | null;
        fetchedAt: number;
    };
    calendar?: {
        data: CalendarData | null;
        fetchedAt: number;
    };
    alert?: {
        data: AlertData | null;
        fetchedAt: number;
    };
}
export declare function readCache(): CacheFile;
export declare function writeCache(cache: CacheFile): void;
