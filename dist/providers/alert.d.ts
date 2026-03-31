import type { AlertData } from '../types.js';
export declare function loadUserCity(): string | null;
export declare function parseAlerts(json: string, city: string): AlertData | null;
export declare function formatAlert(data: AlertData): string;
export declare function fetchAlertSync(city: string): AlertData | null;
