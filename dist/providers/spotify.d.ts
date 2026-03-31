import type { SpotifyData } from '../types.js';
export declare function parseSpotifyOutput(output: string): SpotifyData | null;
export declare function formatSpotify(data: SpotifyData): string;
export declare function fetchSpotifySync(): SpotifyData | null;
