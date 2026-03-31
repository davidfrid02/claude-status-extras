export interface StdinData {
  model?: { id?: string; display_name?: string };
  cwd?: string;
  transcript_path?: string;
  context_window?: {
    context_window_size?: number;
    current_usage?: {
      input_tokens?: number;
      output_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    };
    used_percentage?: number;
    remaining_percentage?: number;
  };
  rate_limits?: {
    five_hour?: { used_percentage?: number; resets_at?: number };
    seven_day?: { used_percentage?: number; resets_at?: number };
  };
}

export interface SpotifyData {
  playing: boolean;
  track: string;
  artist: string;
}

export interface WeatherData {
  display: string; // e.g. "🌤 72°F"
}

export interface CalendarData {
  title: string;
  minutesUntil: number;
}

export interface AlertData {
  active: boolean;
  title: string;  // English translation
  area: string;   // Hebrew area name from API
}

export interface ProviderResult<T> {
  data: T | null;
  fetchedAt: number;
}
