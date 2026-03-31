---
name: status-extras:setup
description: Install and configure the claude-status-extras statusline plugin
allowed-tools: Bash, Read, Edit, AskUserQuestion, Write
---

IMPORTANT: Start IMMEDIATELY with Step 1. Do not run any Bash commands or Read any files before Step 1. The very first thing the user must see is the feature selection prompt.

## Step 1: Feature Selection (FIRST — before anything else)

Use AskUserQuestion IMMEDIATELY as your first action:
- header: "claude-status-extras"
- question: "Which features would you like to enable?"
- multiSelect: true
- options:
  - "📅 Calendar — Next meeting today from personal calendars"
  - "🌤 Weather — Current conditions, auto-detected location"
  - "🎧 Music — Now playing from Spotify or Apple Music"
  - "🚀 Red Alert — Rocket/missile alerts for Israel (Pikud HaOref)"

## Step 2: Red Alert City (only if selected)

If the user selected "Red Alert" in Step 1, use AskUserQuestion:
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

If "Other", ask user to type their city in Hebrew.

## Step 3: Apply Configuration

Now run a SINGLE Bash command that does everything:

```bash
# Detect plugin path
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
extras_dir=$(ls -d "${config_dir}"/plugins/cache/*/claude-status-extras/*/ 2>/dev/null | awk -F/ '{ print $(NF-1) "\t" $0 }' | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n | tail -1 | cut -f2-)

# Check for claude-hud
has_hud=$(grep -q "claude-hud" "${config_dir}/plugins/installed_plugins.json" 2>/dev/null && echo "yes" || echo "no")

# Make wrapper executable
chmod +x "${extras_dir}statusline.sh" 2>/dev/null

# Write Red Alert config if city was provided
# (only include this part if user selected Red Alert)
mkdir -p "${config_dir}/plugins/claude-status-extras"
echo '{"alertCity":"<CITY>"}' > "${config_dir}/plugins/claude-status-extras/config.json"

echo "EXTRAS_DIR:${extras_dir}"
echo "HAS_HUD:${has_hud}"
```

Then use Edit to update `~/.claude/settings.json`:

- If `has_hud` is "yes": set statusLine command to `<extras_dir>statusline.sh`
- If "no": set statusLine command to `bash -c 'exec node <extras_dir>dist/index.js'`

Preserve all existing settings.

## Step 4: Done

Tell the user:

> ✅ **Setup complete!** Restart Claude Code to see your statusline.

Then list only what they selected:
- 📅 Next meeting or "Free rest of day"
- 🌤 Current weather and temperature
- 🎧 Now playing track from Spotify or Apple Music
- 🚀 Red Alert when active in <city>

Use AskUserQuestion:
- question: "After restarting, is the statusline working?"
- options:
  - "Yes, looks great!"
  - "No, I need help"

If "No": tell user to (1) make sure they fully restarted Claude Code, (2) weather takes a few seconds on first run, (3) for calendar issues check System Settings > Internet Accounts.
