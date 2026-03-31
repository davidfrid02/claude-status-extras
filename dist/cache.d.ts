import type { SpotifyData, WeatherData, CalendarData } from './types.js';
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
}
export declare function readCache(): CacheFile;
export declare function writeCache(cache: CacheFile): void;
