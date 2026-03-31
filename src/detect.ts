import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export function isHudInstalled(pluginsJson: unknown): boolean {
  if (!pluginsJson || typeof pluginsJson !== 'object') return false;
  const obj = pluginsJson as Record<string, unknown>;
  const plugins = obj.plugins;
  if (!plugins || typeof plugins !== 'object') return false;
  return Object.keys(plugins as Record<string, unknown>).some((key) =>
    key.startsWith('claude-hud'),
  );
}

export function detectHud(): boolean {
  try {
    const configDir = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude');
    const raw = readFileSync(join(configDir, 'plugins', 'installed_plugins.json'), 'utf8');
    return isHudInstalled(JSON.parse(raw));
  } catch {
    return false;
  }
}
