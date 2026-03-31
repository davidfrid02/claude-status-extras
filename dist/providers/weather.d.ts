import type { WeatherData } from '../types.js';
export declare function getLocaleUnitsParam(locale?: string): string;
export declare function parseWeatherOutput(output: string): WeatherData | null;
export declare function formatWeather(data: WeatherData): string;
export declare function fetchWeatherSync(): WeatherData | null;
