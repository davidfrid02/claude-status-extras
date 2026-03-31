---
name: status-extras:setup
description: Install and configure the claude-status-extras statusline plugin
allowed-tools: Bash, Read, Edit, AskUserQuestion, Write
---

**Note**: This plugin is **macOS only** (requires osascript, Calendar.app).

## Step 1: Check Platform

If Platform is not `darwin`, tell the user: "claude-status-extras only works on macOS." and STOP.

## Step 2: Detect Environment

1. Find the plugin install path:
```bash
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
extras_dir=$(ls -d "${config_dir}"/plugins/cache/*/claude-status-extras/*/ 2>/dev/null | awk -F/ '{ print $(NF-1) "\t" $0 }' | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-)
echo "$extras_dir"
```

If empty, ask the user where they cloned the repo.

2. Check if claude-hud is installed:
```bash
grep -q "claude-hud" ~/.claude/plugins/installed_plugins.json 2>/dev/null && echo "HUD_INSTALLED" || echo "NO_HUD"
```

3. Detect Node.js runtime:
```bash
command -v node 2>/dev/null
```

## Step 3: Build the Plugin

```bash
cd <extras_dir> && npm install && npm run build
```

Verify `dist/index.js` exists after build.

## Step 4: Feature Selection

Use AskUserQuestion:
- header: "Features"
- question: "Which features would you like to enable?"
- multiSelect: true
- options:
  - "Calendar — Next meeting today from personal calendars"
  - "Weather — Current conditions, auto-detected location"
  - "Music — Now playing from Spotify or Apple Music"
  - "Red Alert — Rocket/missile alerts for Israel (Pikud HaOref)"

All features are enabled by default except Red Alert. If the user deselects a feature, note it for the config.

## Step 5: Red Alert City (only if Red Alert was selected)

If the user selected "Red Alert" in Step 4:

Use AskUserQuestion:
- header: "Red Alert Setup"
- question: "Enter your city name in Hebrew (as it appears in Pikud HaOref)"
- options:
  - "רעננה"
  - "תל אביב - יפו"
  - "ירושלים"
  - "חיפה"
  - "באר שבע"
  - "Other — I'll type my city"

If the user picks "Other", ask them to type their city name in Hebrew.

Save the config:
```bash
mkdir -p ~/.claude/plugins/claude-status-extras
```

Write to `~/.claude/plugins/claude-status-extras/config.json`:
```json
{
  "alertCity": "<THE CITY THE USER CHOSE>"
}
```

Tell the user: "Red Alert configured for <city>. The plugin checks every 30 seconds using the Pikud HaOref API. When there's an alert in your area, you'll see a flashing 🚀 ALERT line."

If the user did NOT select Red Alert, skip this step entirely.

## Step 6: Configure statusLine

Update `~/.claude/settings.json` with the statusLine field, preserving all existing settings.

**If claude-hud IS installed (chain mode):**

Make the wrapper executable and point to it:
```bash
chmod +x <extras_dir>/statusline.sh
```

```json
{
  "statusLine": {
    "type": "command",
    "command": "<extras_dir>/statusline.sh"
  }
}
```

**If claude-hud is NOT installed (solo mode):**

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash -c 'exec <node_path> <extras_dir>/dist/index.js'"
  }
}
```

Replace `<node_path>` and `<extras_dir>` with the detected values from Step 2.

## Step 7: Test & Verify

Test the command:
```bash
echo '{"model":{"display_name":"Test"},"cwd":"/tmp"}' | <the statusLine command>
```

If it produces output, tell the user:

> ✅ Setup complete! **Please restart Claude Code** for the statusline to appear.

Use AskUserQuestion:
- question: "After restarting, is the statusline working?"
- options:
  - "Yes, it's working!"
  - "No, something's wrong"

**If yes**: Done! 🎉

**If no**: Debug:
1. Did you restart Claude Code? The statusline only appears after restart.
2. Run the command manually and check for errors
3. Weather takes a moment on first run — wait a few seconds
4. For calendar issues: check System Settings > Internet Accounts has Calendars enabled, and Privacy & Security > Calendars allows your terminal

## Display Reference

| Feature | Display | Refresh |
|---------|---------|---------|
| Calendar | `📅 Standup in 25m` or `✓ Free rest of day` | 3 min |
| Weather | `🌤 72°F` or `⛅ 16°C` | 30 min |
| Music | `🎧 Track — Artist` or `⏸ Track — Artist` | 5 sec |
| Red Alert | `🚀 ALERT: Rockets and Missiles` (flashing) | 30 sec |
