---
name: status-extras:setup
description: Install and configure the claude-status-extras statusline plugin
allowed-tools: Bash, Read, Edit, AskUserQuestion, Write
---

## Step 1: Detect and Build

1. Find the plugin path:
```bash
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
extras_dir=$(find "${config_dir}/plugins/cache" -path "*/claude-status-extras/*/dist/index.js" 2>/dev/null | head -1 | sed 's|/dist/index.js$||')/
has_hud=$(grep -q "claude-hud" "${config_dir}/plugins/installed_plugins.json" 2>/dev/null && echo "yes" || echo "no")
node_path=$(command -v node 2>/dev/null)
chmod +x "${extras_dir}statusline.sh" 2>/dev/null
echo "EXTRAS:${extras_dir} HUD:${has_hud} NODE:${node_path}"
```

If extras_dir is empty, tell user to run `/plugin install claude-status-extras` first and stop.

## Step 2: Configure statusLine

Read `~/.claude/settings.json` and update the statusLine field, preserving all other settings.

- If has_hud is "yes": set statusLine command to `<extras_dir>statusline.sh`
- If has_hud is "no": set statusLine command to `bash -c 'exec <node_path> <extras_dir>dist/index.js'`

## Step 3: Optional Features

After the statusLine is applied, ask the user which features to enable.

Use AskUserQuestion:
- header: "Extras"
- question: "Enable any optional features? (Calendar, Weather, and Music are on by default)"
- multiSelect: true
- options:
  - "🚀 Red Alert — Rocket/missile alerts for Israel (Pikud HaOref)"

**If user selects Red Alert**, proceed to Step 4.
**If user selects nothing**, skip to Step 5.

## Step 4: Red Alert City

Use AskUserQuestion:
- header: "Red Alert — City Selection"
- question: "Select your city (in Hebrew, as it appears in Pikud HaOref):"
- options:
  - "רעננה"
  - "תל אביב - יפו"
  - "ירושלים"
  - "חיפה"
  - "באר שבע"
  - "נתניה"
  - "פתח תקווה"
  - "ראשון לציון"
  - "אשדוד"
  - "Other — I'll type my city name in Hebrew"

If "Other", ask the user to type their city name in Hebrew.

Write the config:
```bash
mkdir -p ~/.claude/plugins/claude-status-extras
```

Write `~/.claude/plugins/claude-status-extras/config.json`:
```json
{"alertCity":"<CITY>"}
```

Tell user: "Red Alert configured for <city>. Checks every 30 seconds."

## Step 5: Verify & Finish

Tell user:

> ✅ Config written. **Please restart Claude Code** for the statusline to appear.

Use AskUserQuestion:
- question: "After restarting, is the statusline working?"
- options:
  - "Yes, it's working!"
  - "No, something's wrong"

**If yes**: Done!

**If no**: Tell user:
1. Make sure you fully quit and reopened Claude Code
2. Weather takes a few seconds on first run
3. Calendar needs System Settings > Internet Accounts > Calendars enabled
4. For Red Alert — check `~/.claude/plugins/claude-status-extras/config.json` has your city
