---
name: status-extras:setup
description: Install and configure the claude-status-extras statusline plugin
---

# Status Extras Setup

Set up claude-status-extras to show Calendar, Weather, and Spotify in your Claude Code statusline.

**Platform:** macOS only (requires osascript, Calendar.app)

## Step 1: Detect Environment

1. Check the platform is macOS (`process.platform === 'darwin'`). If not, inform the user this plugin only works on macOS and stop.

2. Find the plugin install path:
```bash
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
extras_dir=$(ls -d "${config_dir}"/plugins/cache/*/claude-status-extras/*/ 2>/dev/null \
  | awk -F/ '{ print $(NF-1) "\t" $0 }' \
  | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n \
  | tail -1 | cut -f2-)
```

If `extras_dir` is empty, the plugin is not installed via the plugin system. Check if the user cloned it manually and ask for the path.

3. Check if claude-hud is installed by reading `~/.claude/plugins/installed_plugins.json` for a key starting with `claude-hud`.

4. Detect Node.js runtime: prefer `bun` if available, fall back to `node`.

## Step 2: Build the Plugin

Run in the plugin directory:
```bash
cd "$extras_dir" && npm install && npm run build
```

Verify `dist/index.js` exists after build.

## Step 3: Configure statusLine

Update `~/.claude/settings.json` with the `statusLine` field.

### If claude-hud IS installed (chain mode):

Point statusLine to the `statusline.sh` wrapper script which runs both plugins:

```json
{
  "statusLine": {
    "type": "command",
    "command": "<extras_dir>/statusline.sh"
  }
}
```

### If claude-hud is NOT installed (solo mode):

Point statusLine directly to the plugin:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash -c 'exec <node> <extras_dir>/dist/index.js'"
  }
}
```

Replace `<node>` with the detected runtime path and `<extras_dir>` with the resolved plugin path.

Make sure to preserve all other existing settings when writing to `settings.json`.

## Step 4: Verify

1. Tell the user to restart Claude Code.
2. Ask if the statusline is showing.
3. If not, debug:
   - Run the statusLine command manually with test stdin: `echo '{"model":{"display_name":"Test"},"cwd":"/tmp"}' | <command>`
   - Check the exit code is 0
   - Check stderr for errors
   - Verify `dist/index.js` exists
   - On first run, weather takes a moment to fetch (uses wttr.in)

## Step 5: Calendar Permissions

If calendar shows "Free rest of day" but the user has events:

1. Calendar.app must have events from the user's accounts. Open **System Settings > Internet Accounts** and verify the email account has **Calendars** enabled.
2. The first run may trigger a macOS permission dialog for calendar access — the user must click **Allow**.
3. Only personal (writable) calendars are shown. Subscribed calendars, Holidays, and Birthdays are excluded.

## Notes

- **Spotify** is optional — if `/Applications/Spotify.app` doesn't exist, that section is hidden
- **Weather** uses [wttr.in](https://wttr.in) — free, no API key, auto-detects location via IP, temperature units follow system locale
- **Calendar** queries EventKit for the next event today across all personal calendars
- Cache is stored at `/tmp/claude-status-extras-cache.json` with per-provider TTLs (Spotify: 5s, Weather: 30min, Calendar: 3min)
