import type { StdinData } from './types.js';
export declare function parseStdin(raw: string): StdinData | null;
export declare function readStdin(): Promise<StdinData | null>;
