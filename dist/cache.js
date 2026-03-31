import { readFileSync, writeFileSync } from 'node:fs';
const CACHE_PATH = '/tmp/claude-status-extras-cache.json';
export function readCache() {
    try {
        return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
    }
    catch {
        return {};
    }
}
export function writeCache(cache) {
    try {
        writeFileSync(CACHE_PATH, JSON.stringify(cache));
    }
    catch {
        // ignore write failures
    }
}
//# sourceMappingURL=cache.js.map