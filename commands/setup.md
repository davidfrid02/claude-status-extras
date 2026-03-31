---
name: status-extras:setup
description: Install and configure the claude-status-extras statusline plugin
allowed-tools: AskUserQuestion, Bash, Read, Edit, Write
---

Your FIRST action MUST be calling AskUserQuestion. Do NOT call Bash, Read, Edit, or any other tool first. Do NOT "detect environment" or "check platform" before asking. Call AskUserQuestion right now:

header: "claude-status-extras setup"
question: "Which features would you like to enable?"
multiSelect: true
options:
  - "📅 Calendar — Next meeting today from personal calendars"
  - "🌤 Weather — Current conditions, auto-detected location"
  - "🎧 Music — Now playing from Spotify or Apple Music"
  - "🚀 Red Alert — Rocket/missile alerts for Israel (Pikud HaOref)"

After the user responds, if they selected "Red Alert", call AskUserQuestion again:

header: "Red Alert — City Selection"
question: "Select your city (in Hebrew, as it appears in Pikud HaOref):"
options:
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

If "Other", ask user to type their city.

After collecting all user choices, run this single Bash command (replace CITY with the user's city, or remove the config line if Red Alert was not selected):

```bash
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}" && extras_dir=$(find "${config_dir}/plugins/cache" -path "*/claude-status-extras/*/dist/index.js" -exec dirname {} \; 2>/dev/null | head -1 | sed 's|/dist$||')/ && chmod +x "${extras_dir}statusline.sh" 2>/dev/null && has_hud=$(grep -q "claude-hud" "${config_dir}/plugins/installed_plugins.json" 2>/dev/null && echo "yes" || echo "no") && mkdir -p "${config_dir}/plugins/claude-status-extras" && echo '{"alertCity":"CITY"}' > "${config_dir}/plugins/claude-status-extras/config.json" && echo "DONE|${extras_dir}|${has_hud}"
```

Then read `~/.claude/settings.json` and update the statusLine field:
- If has_hud is "yes": set command to `<extras_dir>statusline.sh`
- If has_hud is "no": set command to `bash -c 'exec node <extras_dir>dist/index.js'`

Finally tell the user:

> ✅ **Setup complete!** Restart Claude Code to see your statusline.

And list the features they picked. Then call AskUserQuestion:

question: "After restarting, is it working?"
options:
  - "Yes, looks great!"
  - "No, I need help"

If "No": suggest (1) restart Claude Code fully, (2) weather takes a few seconds first run, (3) calendar needs System Settings > Internet Accounts > Calendars enabled.
