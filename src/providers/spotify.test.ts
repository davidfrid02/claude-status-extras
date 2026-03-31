import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseSpotifyOutput, formatSpotify } from '../providers/spotify.js';

describe('parseSpotifyOutput', () => {
  it('parses playing state', () => {
    const output = 'playing\nBohemian Rhapsody\nQueen';
    const result = parseSpotifyOutput(output);
    assert.deepStrictEqual(result, { playing: true, track: 'Bohemian Rhapsody', artist: 'Queen' });
  });

  it('parses paused state', () => {
    const output = 'paused\nBohemian Rhapsody\nQueen';
    const result = parseSpotifyOutput(output);
    assert.deepStrictEqual(result, { playing: false, track: 'Bohemian Rhapsody', artist: 'Queen' });
  });

  it('returns null for empty output', () => {
    assert.strictEqual(parseSpotifyOutput(''), null);
  });

  it('returns null for incomplete output', () => {
    assert.strictEqual(parseSpotifyOutput('playing\nSong'), null);
  });
});

describe('formatSpotify', () => {
  it('formats playing track', () => {
    const result = formatSpotify({ playing: true, track: 'Bohemian Rhapsody', artist: 'Queen' });
    assert.ok(result.includes('Bohemian Rhapsody'));
    assert.ok(result.includes('Queen'));
    assert.ok(result.includes('♫'));
  });

  it('formats paused track', () => {
    const result = formatSpotify({ playing: false, track: 'Bohemian Rhapsody', artist: 'Queen' });
    assert.ok(result.includes('⏸'));
  });
});
