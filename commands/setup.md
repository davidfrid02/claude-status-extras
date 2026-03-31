---
name: status-extras:setup
description: Install and configure the claude-status-extras statusline plugin
---

# Status Extras Setup

Configure the statusline in `~/.claude/settings.json` to run claude-status-extras.

## Steps

1. Check if claude-hud is installed by reading `~/.claude/plugins/installed_plugins.json`
2. Build the plugin: `cd <plugin-install-path> && npm install && npm run build`
3. Update `~/.claude/settings.json` `statusLine` field:

### If claude-hud IS installed (chain mode):

Set statusLine to a bash wrapper that runs both plugins and combines output:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash -c 'config_dir=\"${CLAUDE_CONFIG_DIR:-$HOME/.claude}\"; hud_dir=$(ls -d \"${config_dir}\"/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-); extras_dir=$(ls -d \"${config_dir}\"/plugins/cache/*/claude-status-extras/*/ 2>/dev/null | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-); stdin_data=$(cat); hud_out=$(echo \"$stdin_data\" | /usr/local/bin/node \"${hud_dir}dist/index.js\" 2>/dev/null); extras_out=$(echo \"$stdin_data\" | /usr/local/bin/node \"${extras_dir}dist/index.js\" 2>/dev/null); [ -n \"$hud_out\" ] && echo \"$hud_out\"; [ -n \"$extras_out\" ] && echo \"$extras_out\"'"
  }
}
```

### If claude-hud is NOT installed (solo mode):

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash -c 'config_dir=\"${CLAUDE_CONFIG_DIR:-$HOME/.claude}\"; extras_dir=$(ls -d \"${config_dir}\"/plugins/cache/*/claude-status-extras/*/ 2>/dev/null | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-); exec /usr/local/bin/node \"${extras_dir}dist/index.js\"'"
  }
}
```

4. Tell the user to restart Claude Code for changes to take effect.

## Notes

- The plugin requires macOS (osascript, Calendar.app, Spotify.app)
- Spotify is optional — if not installed, that section won't appear
- Calendar access may trigger a macOS permission prompt on first run
- Weather uses wttr.in (free, no API key, IP-based location)
