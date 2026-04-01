# claude-status-extras

A statusline plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that shows your next calendar meeting, current weather, and Spotify track — all in one line.

```
📅 Standup in 25m │ 🌤 72°F │ ♫ Bohemian Rhapsody — Queen
```

Works standalone or alongside [claude-hud](https://github.com/jarrodwatts/claude-hud).

> **macOS only** — relies on osascript, Calendar.app, and Spotify.app.

## Installation

### 1. Add the marketplace and install the plugin

```
/plugin install davidfrid02/claude-status-extras
```

### 2. Run setup

```
/status-extras:setup
```

This will:
- Detect if claude-hud is installed
- Build the plugin
- Configure your `~/.claude/settings.json` statusline
- Verify everything works

### 3. Restart Claude Code

The statusline appears below your input prompt after restart.

## What You See

| State | Display |
|-------|---------|
| All active | `📅 Standup in 25m │ 🌤 72°F │ ♫ Bohemian Rhapsody — Queen` |
| Spotify paused | `📅 Standup in 25m │ 🌤 72°F │ ⏸ Bohemian Rhapsody — Queen` |
| No meetings | `✓ Free rest of day │ 🌤 72°F │ ♫ Bohemian Rhapsody — Queen` |
| No Spotify | `📅 Standup in 25m │ 🌤 72°F` |
| Only weather | `🌤 72°F` |

Items that aren't available are automatically hidden — no error messages, no empty slots.

### With claude-hud installed

```
[Opus] │ my-project git:(main)
Context █████░░░░░ 45% │ Usage ██░░░░░░ 18%
✓ Free rest of day │ 🌤 72°F │ ♫ Bohemian Rhapsody — Queen
```

## Features

### Calendar (macOS only)

- Shows your next upcoming meeting today from **personal calendars only**
- Excludes Holidays, Birthdays, and Subscribed (read-only) calendars
- Time formatting:
  - Under 60 min: `Standup in 25m`
  - 1-3 hours: `Standup in 2h`
  - Over 3 hours: `Standup at 4:30pm`
  - Happening now: `Standup now`
- When no meetings remain: `✓ Free rest of day`
- Refreshes every **3 minutes**

### Weather

- Uses [wttr.in](https://wttr.in) — free, no API key required
- Location auto-detected via IP geolocation
- Temperature units follow your system locale (°F for US, °C for everyone else)
- Refreshes every **30 minutes**

### Spotify (macOS only)

- Shows current track and artist
- Playing: `♫ Track — Artist` (green)
- Paused: `⏸ Track — Artist` (dimmed)
- Stopped or not installed: hidden entirely
- Requires [Spotify desktop app](https://www.spotify.com/download/mac/) (not the web player)
- Refreshes every **5 seconds**

## Calendar Setup Guide

If the calendar shows "Free rest of day" but you have events, follow these steps:

### 1. Connect your email account to macOS

1. Open **System Settings** (or System Preferences on older macOS)
2. Go to **Internet Accounts**
3. Add your account (Google, Microsoft, iCloud, etc.)
4. Make sure **Calendars** is toggled **ON** for that account

### 2. For Gmail / Google Calendar

1. In **System Settings > Internet Accounts**, click **Google**
2. Sign in with your Google account
3. Enable the **Calendars** toggle
4. Open **Calendar.app** and verify your events appear there
5. It may take a few minutes for events to sync

### 3. For Outlook / Microsoft 365

1. In **System Settings > Internet Accounts**, click **Microsoft Exchange** or **Microsoft 365**
2. Sign in with your work/school account
3. Enable the **Calendars** toggle
4. Open **Calendar.app** and verify your events appear

### 4. Grant calendar permissions

On first run, macOS may prompt you to allow calendar access. Click **Allow**. If you missed the prompt:

1. Open **System Settings > Privacy & Security > Calendars**
2. Find the terminal app you use (Terminal, iTerm2, Warp, etc.)
3. Toggle it **ON**

### 5. Verify in Calendar.app

Open Calendar.app and confirm:
- Your account appears in the sidebar
- Events are visible for today
- The calendar is a personal/writable calendar (not a subscribed/read-only one)

## How It Works

```
Claude Code (every ~300ms)
    │
    ├── Sends JSON via stdin (model, context, cwd)
    │
    ▼
statusline.sh
    │
    ├── Runs claude-hud (if installed) → prints HUD lines
    │
    ├── Runs claude-status-extras/dist/index.js
    │   ├── Reads file cache (/tmp/claude-status-extras-cache.json)
    │   ├── Fetches stale providers synchronously:
    │   │   ├── Spotify: osascript → Spotify.app (5s TTL)
    │   │   ├── Weather: curl → wttr.in (30min TTL)
    │   │   └── Calendar: osascript → EventKit (3min TTL)
    │   ├── Writes updated cache
    │   └── Prints ANSI-colored line to stdout
    │
    ▼
Claude Code displays below input prompt
```

### Caching

Each provider has its own refresh interval. Data is cached to `/tmp/claude-status-extras-cache.json` so it persists between invocations. Only stale providers are re-fetched — the rest are served from cache instantly.

| Provider | TTL | Method |
|----------|-----|--------|
| Spotify | 5 seconds | osascript (local, fast) |
| Calendar | 3 minutes | osascript + EventKit (local) |
| Weather | 30 minutes | curl to wttr.in (network) |

## Requirements

- **macOS** (Darwin) — osascript is required for Spotify and Calendar
- **Node.js 18+**
- **Claude Code v1.0.80+**
- **Spotify desktop app** (optional — section hides if not installed)
- **Calendar.app** with at least one account connected (optional)

## Troubleshooting

### Nothing shows in the statusline

1. Restart Claude Code after running setup
2. Test the command manually:
   ```bash
   echo '{"model":{"display_name":"Test"},"cwd":"/tmp"}' | /path/to/statusline.sh
   ```
3. Check exit code is 0
4. First run may be blank while weather fetches from wttr.in — wait a few seconds and it appears

### Calendar always shows "Free rest of day"

- Verify events are visible in Calendar.app
- Check **System Settings > Internet Accounts** — is Calendars enabled?
- Check **System Settings > Privacy & Security > Calendars** — is your terminal allowed?
- Only writable (personal) calendars are checked — subscribed/holiday calendars are excluded

### Weather not showing

- Requires internet access
- Uses `curl` to fetch from `wttr.in` — check if `curl http://wttr.in/?format=%c%t` works in your terminal
- Weather refreshes every 30 minutes — on first run it may take a moment

### Spotify not showing

- Requires `/Applications/Spotify.app` — web player is not supported
- Spotify must be running with a track loaded (stopped state = hidden)
- If Spotify is paused, it shows with a ⏸ icon in dimmed color

## Development

```bash
git clone https://github.com/davidfrid02/claude-status-extras.git
cd claude-status-extras
npm install
npm run build
npm test
```

## License

MIT
