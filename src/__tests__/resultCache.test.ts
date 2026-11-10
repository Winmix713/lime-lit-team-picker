import { webcrypto } from 'node:crypto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computeLeaguePipeline, ENGINE_VERSION, type PipelineParams } from '../utils/pipeline';
import { readResultCache, writeResultCache, resultInputSignature, type ResultCacheKey } from '../utils/resultCache';
import { disposePipelineWorkers, runLeaguePipeline } from '../utils/pipelineRunner';
import { __resetLoadTiming, startLoadTiming, finishLoadTiming } from '../utils/loadTiming';

const params: PipelineParams = {
  league: 'angol', weights: {}, historyScope: 'league-cumulative',
  experiments: { dixonColes: false, glicko2: false }, checkpoint: null, forceFullRebuild: false,
  seasons: [{ id: 'league-season', league: 'angol', name: 'Test', fileName: 'test.csv',
    seasonIndex: 1, createdAt: '2026-01-01T00:00:00Z', countWarning: false,
    contentHash: 'test-input', actualMatchCount: 8,
    matches: Array.from({ length: 8 }, (_, i) => ({ match_no: i + 1, home_team: 'Arsenal',
      away_team: 'Chelsea', home_score: i % 3, away_score: i % 2,
      date: '', ht_home_score: null, ht_away_score: null,
      total_goals: i % 3 + i % 2, btts: i % 3 > 0 && i % 2 > 0,
      outcome: i % 3 > i % 2 ? 'H' as const : i % 3 < i % 2 ? 'A' as const : 'D' as const })) }],
};
let key: ResultCacheKey;
beforeEach(async () => {
  vi.stubGlobal('indexedDB', new IDBFactory());
  vi.stubGlobal('crypto', webcrypto);
  key = { fingerprint: 'cloud-a', engineVersion: ENGINE_VERSION, matchCount: 8,
    inputSignature: await resultInputSignature(params) };
});
afterEach(() => { disposePipelineWorkers(); __resetLoadTiming(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('finished results cache', () => {
  it('hits on matching fingerprint and preserves the entire fresh output exactly', async () => {
    const fresh = await computeLeaguePipeline(params);
    await writeResultCache('angol', key, fresh);
    expect(await readResultCache('angol', key)).toEqual(fresh);
  });
  it('misses when the cloud fingerprint changes', async () => {
    await writeResultCache('angol', key, await computeLeaguePipeline(params));
    expect(await readResultCache('angol', { ...key, fingerprint: 'cloud-b' })).toBeNull();
  });
  it('misses when the engine version changes', async () => {
    await writeResultCache('angol', key, await computeLeaguePipeline(params));
    expect(await readResultCache('angol', { ...key, engineVersion: 'next' })).toBeNull();
  });
  it('misses on counts and settings and same-count score edits', async () => {
    await writeResultCache('angol', key, await computeLeaguePipeline(params));
    expect(await readResultCache('angol', { ...key, matchCount: 9 })).toBeNull();
    for (const input of [{ ...params, weights: { arsenal: 1.7 } },
      { ...params, historyScope: 'season-only' as const },
      { ...params, experiments: { dixonColes: true, glicko2: false } },
      { ...params, seasons: params.seasons.map(s => ({ ...s, matches: s.matches.map(m => ({ ...m, home_score: 5 })) })) }]) {
      expect(await readResultCache('angol', { ...key, inputSignature: await resultInputSignature(input) })).toBeNull();
    }
  });
  it('deletes corrupt results instead of returning partial output', async () => {
    const db = await new Promise<IDBDatabase>(resolve => {
      const req = indexedDB.open('winmix-result-cache', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('leagues');
      req.onsuccess = () => resolve(req.result);
    });
    await new Promise<void>(resolve => {
      const tx = db.transaction('leagues', 'readwrite');
      tx.objectStore('leagues').put({ ...key, results: { seasons: [] } }, 'angol');
      tx.oncomplete = () => resolve();
    });
    expect(await readResultCache('angol', key)).toBeNull();
    const stored = await new Promise(resolve => {
      const req = db.transaction('leagues').objectStore('leagues').get('angol');
      req.onsuccess = () => resolve(req.result);
    });
    expect(stored).toBeUndefined();
    db.close();
  });
  it('skips worker construction on the second run, with deep-equal results and cache timing', async () => {
    const worker = vi.fn(function () { throw new Error('inline first run'); });
    vi.stubGlobal('Worker', worker);
    const fresh = await runLeaguePipeline(params, key.fingerprint);
    disposePipelineWorkers();
    worker.mockClear();
    startLoadTiming('boot');
    vi.spyOn(console, 'table').mockImplementation(() => {});
    const cached = await runLeaguePipeline(params, key.fingerprint);
    expect(cached.mode).toBe('cache');
    const { mode: _freshMode, ...freshOutput } = fresh;
    const { mode: _cachedMode, ...cachedOutput } = cached;
    expect(cachedOutput).toEqual(freshOutput);
    expect(worker).not.toHaveBeenCalled();
    const timing = finishLoadTiming();
    expect(timing?.resultCacheHit).toBe(true);
    expect(timing?.rows.map(r => r.phase)).toEqual(['cacheRead']);
  });
  it('honors forced rebuilding despite a matching entry', async () => {
    await writeResultCache('angol', key, await computeLeaguePipeline(params));
    const result = await runLeaguePipeline({ ...params, forceFullRebuild: true }, key.fingerprint);
    expect(result.mode).not.toBe('cache');
    expect(result.reusedMatches).toBe(0);
  });
});