---
name: status-extras:setup
description: Install and configure the claude-status-extras statusline plugin
allowed-tools: Bash, Read, Edit, AskUserQuestion, Write
---

## Important UX Rules

- Do NOT show or explain bash commands to the user
- Do NOT print detection results, paths, or debug info
- Keep ALL technical output hidden — the user should only see friendly messages and the AskUserQuestion prompts
- If a step fails, show a simple error message, not raw command output

## Step 1: Silent Detection (do not show output to user)

Run ALL of these in a single bash call, silently. Do not print results to the user:

```bash
echo "PLATFORM:$(uname)" && \
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}" && \
extras_dir=$(ls -d "${config_dir}"/plugins/cache/*/claude-status-extras/*/ 2>/dev/null | awk -F/ '{ print $(NF-1) "\t" $0 }' | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-) && \
echo "EXTRAS:${extras_dir}" && \
hud=$(grep -q "claude-hud" "${config_dir}/plugins/installed_plugins.json" 2>/dev/null && echo "YES" || echo "NO") && \
echo "HUD:${hud}" && \
echo "NODE:$(command -v node 2>/dev/null)"
```

If platform is not Darwin, tell user "This plugin only works on macOS" and stop.
If extras_dir is empty, tell user "Plugin not found. Run `/plugin install claude-status-extras` first." and stop.

## Step 2: Silent Build (do not show output to user)

Run silently:
```bash
cd <extras_dir> && npm install --silent 2>/dev/null && npm run build --silent 2>/dev/null && echo "BUILD:OK"
```

If build fails, tell user "Build failed. Please report this issue." and stop.

## Step 3: Feature Selection

Now show the FIRST interactive prompt to the user.

Use AskUserQuestion:
- header: "claude-status-extras"
- question: "Which features would you like to enable?"
- multiSelect: true
- options:
  - "📅 Calendar — Next meeting today from personal calendars"
  - "🌤 Weather — Current conditions, auto-detected location"
  - "🎧 Music — Now playing from Spotify or Apple Music"
  - "🚀 Red Alert — Rocket/missile alerts for Israel (Pikud HaOref)"

## Step 4: Red Alert City (only if Red Alert was selected in Step 3)

If the user selected Red Alert:

Use AskUserQuestion:
- header: "Red Alert Setup"
- question: "Select your city (as it appears in Pikud HaOref):"
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
  - "Other — I'll type my city name"

If "Other" is selected, ask the user to type their city name in Hebrew.

Then silently run:
```bash
mkdir -p ~/.claude/plugins/claude-status-extras
```

Write to `~/.claude/plugins/claude-status-extras/config.json`:
```json
{"alertCity":"<CITY>"}
```

Tell user: "✅ Red Alert configured for <city>."

If Red Alert was NOT selected, skip this step.

## Step 5: Configure statusLine (silent)

Silently update `~/.claude/settings.json`, preserving all existing settings.

**If claude-hud is installed:** Set statusLine command to `<extras_dir>/statusline.sh` (make sure to `chmod +x` it first).

**If claude-hud is NOT installed:** Set statusLine command to `bash -c 'exec <node_path> <extras_dir>/dist/index.js'`

## Step 6: Done

Tell the user:

> ✅ **Setup complete!** Restart Claude Code to see your statusline.
>
> Your statusline will show:

Then list only the features they selected, e.g.:
- 📅 Next meeting or "Free rest of day"
- 🌤 Current weather
- 🎧 Now playing track
- 🚀 Red Alert when active in your area

Then:

Use AskUserQuestion:
- question: "After restarting Claude Code, is the statusline working?"
- options:
  - "Yes!"
  - "No, I need help"

**If "No":**
Tell user:
1. Make sure you fully quit and reopened Claude Code
2. Weather may take a few seconds to appear on first run
3. If calendar shows "Free rest of day" unexpectedly — check System Settings > Internet Accounts has Calendars enabled for your email
4. If nothing shows at all, run `/status-extras:setup` again
