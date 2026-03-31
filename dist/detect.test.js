import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isHudInstalled } from './detect.js';
describe('isHudInstalled', () => {
    it('returns true when claude-hud is in plugins', () => {
        const json = {
            version: 2,
            plugins: {
                'claude-hud@claude-hud': [{ scope: 'user', version: '0.0.11' }],
            },
        };
        assert.strictEqual(isHudInstalled(json), true);
    });
    it('returns false when claude-hud is absent', () => {
        const json = {
            version: 2,
            plugins: {
                'other-plugin@other': [{ scope: 'user', version: '1.0.0' }],
            },
        };
        assert.strictEqual(isHudInstalled(json), false);
    });
    it('returns false for null input', () => {
        assert.strictEqual(isHudInstalled(null), false);
    });
});
//# sourceMappingURL=detect.test.js.map