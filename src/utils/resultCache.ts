import type { League } from '../types/winmix';
import type { PipelineParams, PipelineResult } from './pipeline';

const DB_NAME = 'winmix-result-cache';
const STORE = 'leagues';

export interface ResultCacheKey {
  fingerprint: string;
  engineVersion: string;
  matchCount: number;
  inputSignature: string;
}
export interface ResultCacheEntry extends ResultCacheKey { results: PipelineResult }

// Include every raw input, including chronology and settings; never derived output.
export async function resultInputSignature(params: PipelineParams): Promise<string> {
  const input = JSON.stringify({
    seasons: params.seasons.filter(s => s.league === params.league).map(s => ({
      ...s, matches: s.matches.map(({ pipeline: _pipeline, ...raw }) => raw),
    })),
    weights: Object.entries(params.weights).sort(([a], [b]) => a.localeCompare(b)),
    historyScope: params.historyScope,
    experiments: params.experiments,
  });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
}

function openDB(): Promise<IDBDatabase | null> {
  return new Promise(resolve => {
    if (typeof indexedDB === 'undefined') { resolve(null); return; }
    let settled = false;
    const timer = setTimeout(() => { settled = true; resolve(null); }, 1000);
    const finish = (db: IDBDatabase | null) => {
      clearTimeout(timer);
      if (settled) { db?.close(); return; }
      settled = true;
      resolve(db);
    };
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE);
      request.onsuccess = () => finish(request.result);
      request.onerror = () => finish(null);
      request.onblocked = () => finish(null);
    } catch { finish(null); }
  });
}

async function transaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T | null> {
  const db = await openDB();
  if (!db) return null;
  try {
    return await new Promise<T | null>(resolve => {
      const tx = db.transaction(STORE, mode);
      const request = operation(tx.objectStore(STORE));
      const timer = setTimeout(() => { try { tx.abort(); } catch { /* optional */ } resolve(null); }, 1500);
      const finish = (value: T | null) => { clearTimeout(timer); resolve(value); };
      tx.oncomplete = () => finish(request.result ?? null);
      tx.onerror = tx.onabort = () => finish(null);
    });
  } catch { return null; }
  finally { db.close(); }
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isValidResultEntry(value: unknown, league: League): value is ResultCacheEntry {
  if (!record(value) || typeof value.fingerprint !== 'string' || typeof value.engineVersion !== 'string' ||
      typeof value.inputSignature !== 'string' || !Number.isInteger(value.matchCount) || !record(value.results)) return false;
  const result = value.results;
  if (!Array.isArray(result.seasons) || !record(result.calibration) || !record(result.checkpoint) ||
      result.checkpoint.league !== league || result.checkpoint.processedMatchCount !== value.matchCount ||
      !Array.isArray(result.checkpoint.m1Samples) || !Array.isArray(result.checkpoint.calibSample) ||
      !Array.isArray(result.checkpoint.ensSamples) || !Array.isArray(result.calibration.history) ||
      typeof result.calibration.T !== 'number' || !Number.isFinite(result.calibration.T) ||
      !['full', 'incremental'].includes(String(result.kind)) || typeof result.reusedMatches !== 'number' ||
      !(result.rebuildReason === null || typeof result.rebuildReason === 'string')) return false;
  let count = 0;
  for (const season of result.seasons) {
    if (!record(season) || season.league !== league || typeof season.id !== 'string' || !Array.isArray(season.matches)) return false;
    for (const match of season.matches) {
      if (!record(match) || !record(match.pipeline) || !record(match.pipeline.features) ||
          !record(match.pipeline.secondary) || !record(match.pipeline.context)) return false;
      for (const name of ['b0', 'b1', 'm1', 'ensRaw', 'calibrated']) {
        const probs = match.pipeline[name];
        if (!record(probs) || !['home', 'draw', 'away'].every(key => typeof probs[key] === 'number' && Number.isFinite(probs[key]) && probs[key] >= 0 && probs[key] <= 1)) return false;
      }
      count++;
    }
  }
  return count === value.matchCount;
}

export async function readResultCache(league: League, key: ResultCacheKey): Promise<PipelineResult | null> {
  const entry: unknown = await transaction('readonly', store => store.get(league));
  if (entry === null) {
    await transaction('readwrite', store => store.delete(league));
    return null;
  }
  if (!isValidResultEntry(entry, league)) {
    await transaction('readwrite', store => store.delete(league));
    return null;
  }
  if (entry.fingerprint !== key.fingerprint || entry.engineVersion !== key.engineVersion ||
      entry.matchCount !== key.matchCount || entry.inputSignature !== key.inputSignature) return null;
  return entry.results;
}

export async function writeResultCache(league: League, key: ResultCacheKey, results: PipelineResult): Promise<void> {
  const entry: ResultCacheEntry = { ...key, results };
  if (!isValidResultEntry(entry, league)) return;
  await transaction('readwrite', store => store.put(entry, league));
}

export async function clearResultCache(): Promise<void> {
  await transaction('readwrite', store => store.clear());
}