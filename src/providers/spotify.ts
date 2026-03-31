import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import type { SpotifyData, ProviderResult } from '../types.js';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';

const CACHE_TTL = 5_000; // 5 seconds
let cache: ProviderResult<SpotifyData> = { data: null, fetchedAt: 0 };
let fetching = false;
let spotifyDisabled = false;

const OSASCRIPT = `
tell application "System Events"
  if not (exists process "Spotify") then
    return "not_running"
  end if
end tell
tell application "Spotify"
  set playerState to player state as string
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

function fetchSpotify(): void {
  if (fetching) return;
  fetching = true;
  execFile('osascript', ['-e', OSASCRIPT], { timeout: 2_000 }, (err, stdout) => {
    fetching = false;
    if (err) {
      cache = { data: null, fetchedAt: Date.now() };
      return;
    }
    cache = { data: parseSpotifyOutput(stdout), fetchedAt: Date.now() };
  });
}

export function getSpotify(): SpotifyData | null {
  if (spotifyDisabled) return null;
  if (!existsSync('/Applications/Spotify.app')) {
    spotifyDisabled = true;
    return null;
  }
  const elapsed = Date.now() - cache.fetchedAt;
  if (elapsed > CACHE_TTL) {
    fetchSpotify();
  }
  return cache.data;
}
