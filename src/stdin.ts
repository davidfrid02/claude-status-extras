import type { StdinData } from './types.js';

export function parseStdin(raw: string): StdinData | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as StdinData;
  } catch {
    return null;
  }
}

export async function readStdin(): Promise<StdinData | null> {
  if (process.stdin.isTTY) return null;
  const chunks: string[] = [];
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    chunks.push(chunk as string);
  }
  return parseStdin(chunks.join(''));
}
