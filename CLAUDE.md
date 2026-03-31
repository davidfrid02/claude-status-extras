# claude-status-extras

macOS-only Claude Code statusline plugin. Shows Calendar | Weather | Spotify in one line.

## Build

npm install && npm run build

## Architecture

- src/index.ts — entry point, reads stdin, orchestrates providers, outputs ANSI line
- src/providers/spotify.ts — osascript to get Spotify player state
- src/providers/weather.ts — http.get to wttr.in for weather
- src/providers/calendar.ts — osascript to query EventKit for next personal meeting
- src/detect.ts — detect claude-hud presence in installed_plugins.json
- src/render.ts — format and colorize the output line
- src/config.ts — load user config from ~/.claude/plugins/claude-status-extras/config.json
