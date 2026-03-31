import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseCalendarOutput, formatCalendar } from '../providers/calendar.js';
describe('parseCalendarOutput', () => {
    it('parses event with minutes until', () => {
        const result = parseCalendarOutput('Standup\n25');
        assert.deepStrictEqual(result, { title: 'Standup', minutesUntil: 25 });
    });
    it('returns null for empty output', () => {
        assert.strictEqual(parseCalendarOutput(''), null);
    });
    it('returns null for no_events marker', () => {
        assert.strictEqual(parseCalendarOutput('no_events'), null);
    });
    it('returns null for incomplete output', () => {
        assert.strictEqual(parseCalendarOutput('Standup'), null);
    });
});
describe('formatCalendar', () => {
    it('formats event under 60 minutes as Nm', () => {
        const result = formatCalendar({ title: 'Standup', minutesUntil: 25 });
        assert.ok(result.includes('Standup in 25m'));
        assert.ok(result.includes('📅'));
    });
    it('formats event 60-180 minutes as Nh', () => {
        const result = formatCalendar({ title: 'Review', minutesUntil: 120 });
        assert.ok(result.includes('Review in 2h'));
    });
    it('formats event over 180 minutes as clock time', () => {
        const result = formatCalendar({ title: 'Sync', minutesUntil: 240 });
        assert.ok(result.includes('Sync at'));
        assert.match(result, /Sync at \d{1,2}:\d{2}[ap]m/);
    });
    it('formats zero minutes as "now"', () => {
        const result = formatCalendar({ title: 'Standup', minutesUntil: 0 });
        assert.ok(result.includes('Standup now'));
    });
});
//# sourceMappingURL=calendar.test.js.map