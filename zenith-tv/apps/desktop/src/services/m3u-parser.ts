/**
 * M3U Parser Service
 * Fetches and parses M3U playlists
 */

import { initParser, parseM3U, type ParsedM3UItem } from '@zenith-tv/parser';
import type { WatchableItem } from '@zenith-tv/types';

let parserInitialized = false;

/**
 * Ensure WASM parser is initialized
 */
async function ensureParserInit(): Promise<void> {
  if (!parserInitialized) {
    await initParser();
    parserInitialized = true;
  }
}

/**
 * Fetch M3U content from URL
 */
export async function fetchM3U(
  url: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch M3U: ${response.statusText}`);
  }

  const contentLength = parseInt(response.headers.get('content-length') || '0', 10);

  if (!contentLength) {
    // No content length, just get text
    return await response.text();
  }

  // Stream with progress
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const chunks: Uint8Array[] = [];
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    if (value) {
      chunks.push(value);
      receivedLength += value.length;

      if (onProgress) {
        const percent = (receivedLength / contentLength) * 100;
        onProgress(percent);
      }
    }
  }

  // Combine chunks
  const chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }

  return new TextDecoder('utf-8').decode(chunksAll);
}

/**
 * Parse M3U content using Rust WASM parser
 */
export async function parseM3UContent(content: string): Promise<ParsedM3UItem[]> {
  await ensureParserInit();
  return await parseM3U(content);
}

/**
 * Convert parsed M3U items to WatchableItem format
 */
export function convertToWatchableItems(
  items: ParsedM3UItem[],
  profileId: number
): WatchableItem[] {
  return items.map((item) => ({
    ...item,
    profileId,
    addedDate: new Date(),
    isFavorite: false,
  }));
}

/**
 * Full pipeline: Fetch → Parse → Convert
 */
export async function fetchAndParseM3U(
  url: string,
  profileId: number,
  onProgress?: (stage: string, percent?: number) => void
): Promise<WatchableItem[]> {
  try {
    // Stage 1: Fetch
    onProgress?.('Downloading M3U...', 0);
    const content = await fetchM3U(url, (percent) => {
      onProgress?.('Downloading M3U...', percent);
    });

    // Stage 2: Parse
    onProgress?.('Parsing M3U...', 0);
    const parsed = await parseM3UContent(content);

    // Stage 3: Convert
    onProgress?.('Processing items...', 0);
    const items = convertToWatchableItems(parsed, profileId);

    onProgress?.('Complete', 100);
    return items;
  } catch (error) {
    console.error('M3U fetch/parse error:', error);
    throw error;
  }
}
