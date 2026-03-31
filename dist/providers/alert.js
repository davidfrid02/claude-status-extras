import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const RED_BG = '\x1b[41m';
const WHITE = '\x1b[97m';
const BLINK = '\x1b[5m';
const HISTORY_URL = 'https://www.oref.org.il/warningMessages/alert/History/AlertsHistory.json';
const CATEGORY_NAMES = {
    1: 'Rockets and Missiles',
    2: 'Hostile Aircraft',
    3: 'Earthquake',
    4: 'Tsunami',
    5: 'Hazardous Materials',
    6: 'Terrorist Attack',
    7: 'Infiltration',
    13: 'Event Ended',
};
export function loadUserCity() {
    try {
        const configDir = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude');
        const configPath = join(configDir, 'plugins', 'claude-status-extras', 'config.json');
        const config = JSON.parse(readFileSync(configPath, 'utf8'));
        return config.alertCity ?? null;
    }
    catch {
        return null;
    }
}
export function parseAlerts(json, city) {
    try {
        const alerts = JSON.parse(json);
        if (!Array.isArray(alerts) || alerts.length === 0)
            return null;
        const now = Date.now();
        const fiveMinAgo = now - 5 * 60_000;
        // Find active alerts (not "event ended") for the user's city within last 5 minutes
        for (const alert of alerts) {
            if (alert.category === 13)
                continue; // skip "event ended"
            // Parse alert date (format: "2026-03-31 23:13:07", Israel time)
            const alertTime = new Date(alert.alertDate.replace(' ', 'T') + '+03:00').getTime();
            if (alertTime < fiveMinAgo)
                continue; // older than 5 minutes
            // Check if city matches (case-insensitive, trim whitespace)
            if (alert.data.trim() === city.trim()) {
                return {
                    active: true,
                    title: CATEGORY_NAMES[alert.category] ?? 'Alert',
                    area: alert.data,
                };
            }
        }
        return null;
    }
    catch {
        return null;
    }
}
export function formatAlert(data) {
    return `${BLINK}${RED_BG}${WHITE} 🚀 ALERT: ${data.title} ${RESET}`;
}
export function fetchAlertSync(city) {
    try {
        const stdout = execFileSync('curl', [
            '-s',
            '--max-time', '5',
            '-H', 'Referer: https://www.oref.org.il/',
            '-H', 'X-Requested-With: XMLHttpRequest',
            HISTORY_URL,
        ], {
            timeout: 8_000,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore'],
        });
        return parseAlerts(stdout, city);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=alert.js.map