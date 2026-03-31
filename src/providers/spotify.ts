import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import type { SpotifyData } from '../types.js';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';

const OSASCRIPT = `
tell application "System Events"
  if not (exists process "Spotify") then
    return "not_running"
  end if
end tell
tell application "Spotify"
  set playerState to player state as string
  if playerState is "stopped" then
    return "not_running"
  end if
  set trackName to name of current track
  set artistName to artist of current track
  return playerState & "\\n" & trackName & "\\n" & artistName
end tell
`;

export function parseSpotifyOutput(output: string): SpotifyData | null {
  const trimmed = output.trim();
  if (!trimmed || trimmed === 'not_running') return null;
  const lines = trimmed.split('\n');
  if (lines.length < 3) return null;
  const [state, track, artist] = lines;
  return {
    playing: state === 'playing',
    track,
    artist,
  };
}

export function formatSpotify(data: SpotifyData): string {
  if (data.playing) {
    return `${GREEN}♫ ${data.track} — ${data.artist}${RESET}`;
  }
  return `${DIM}⏸ ${data.track} — ${data.artist}${RESET}`;
}

export function fetchSpotifySync(): SpotifyData | null {
  if (!existsSync('/Applications/Spotify.app')) return null;
  try {
    const stdout = execFileSync('osascript', ['-e', OSASCRIPT], {
      timeout: 2_000,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return parseSpotifyOutput(stdout);
  } catch {
    return null;
  }
}
