---
name: status-extras:setup
description: Install and configure the claude-status-extras statusline plugin
---

# Status Extras Setup

You MUST follow these steps IN ORDER. Do NOT skip any step. Do NOT assume anything is already configured. Execute each step even if you think setup was done before.

## Step 1: Check Platform

Run: `uname -s`

If the output is not `Darwin`, tell the user: "This plugin only works on macOS." and STOP.

## Step 2: Find Plugin Path

Run this command and save the output as `extras_dir`:

```bash
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}" && ls -d "${config_dir}"/plugins/cache/*/claude-status-extras/*/ 2>/dev/null | awk -F/ '{ print $(NF-1) "\t" $0 }' | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-
```

If empty, ask the user where they cloned the repo.

## Step 3: Build

Run:
```bash
cd <extras_dir> && npm install && npm run build
```

Verify `dist/index.js` exists.

## Step 4: Configure statusLine

Check if claude-hud is installed:
```bash
grep -q "claude-hud" ~/.claude/plugins/installed_plugins.json 2>/dev/null && echo "HUD_INSTALLED" || echo "NO_HUD"
```

**If HUD_INSTALLED:** Update `~/.claude/settings.json` and set:
```json
"statusLine": {
  "type": "command",
  "command": "<extras_dir>/statusline.sh"
}
```
Make sure `statusline.sh` is executable: `chmod +x <extras_dir>/statusline.sh`

**If NO_HUD:** Update `~/.claude/settings.json` and set:
```json
"statusLine": {
  "type": "command",
  "command": "bash -c 'exec node <extras_dir>/dist/index.js'"
}
```

Preserve all other existing settings in the file.

## Step 5: Red Alert Configuration

THIS STEP IS MANDATORY. You MUST ask the user this question. Do NOT skip it.

Say EXACTLY this to the user:

> **Would you like to enable Red Alert notifications? (Israel only)**
> This shows a flashing 🚀 ALERT in your statusbar when there's a rocket/missile alert in your area, using the Pikud HaOref (Home Front Command) API.

Then STOP and WAIT for the user to respond. Do not continue until they answer.

**If the user says YES:**

Say EXACTLY this:

> **Please enter your city name in Hebrew** (exactly as it appears in Pikud HaOref, e.g. רעננה, תל אביב - יפו, ירושלים, חיפה, באר שבע):

STOP and WAIT for the user to type their city. Then run:

```bash
mkdir -p ~/.claude/plugins/claude-status-extras
```

Write this to `~/.claude/plugins/claude-status-extras/config.json`:
```json
{"alertCity":"<THE CITY THE USER TYPED>"}
```

Then say: "Red Alert is configured for <city>. The plugin checks every 30 seconds."

**If the user says NO:**

Say: "OK, Red Alert is disabled. You can enable it later by creating `~/.claude/plugins/claude-status-extras/config.json` with `{\"alertCity\":\"YOUR_CITY_IN_HEBREW\"}`"

## Step 6: Verify

Run the statusline command with test input:
```bash
echo '{"model":{"display_name":"Test"},"cwd":"/tmp"}' | <the statusLine command from step 4>
```

If it produces output, say: "Setup complete! Restart Claude Code to see the statusline."

If no output or error, debug:
- Check `dist/index.js` exists
- Check exit code is 0
- Weather may take a moment on first run

## Step 7: Calendar Info

Tell the user:

> **Calendar note:** If calendar shows "Free rest of day" but you have events, make sure:
> 1. Your email account is connected in **System Settings > Internet Accounts** with **Calendars** enabled
> 2. Events are visible in Calendar.app
> 3. Your terminal has calendar permission in **System Settings > Privacy & Security > Calendars**

## Features

- **Calendar** — next meeting today from personal calendars (3 min refresh)
- **Weather** — auto-detected location via IP, locale-based units (30 min refresh)
- **Music** — Spotify or Apple Music, whichever is playing (5 sec refresh)
- **Red Alert** — optional, Israel only, Pikud HaOref API (30 sec refresh)
