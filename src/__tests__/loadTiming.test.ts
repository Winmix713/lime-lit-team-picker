import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  __resetLoadTiming,
  beginPhase,
  endPhase,
  finishLoadTiming,
  isLoadTimingActive,
  setCacheHit,
  startLoadTiming
} from '../utils/loadTiming';
import { getLatestLoadTiming, measurePhase, recordPhaseDuration, subscribeLoadTiming } from '../utils/loadTiming';

afterEach(() => {
  __resetLoadTiming();
  vi.restoreAllMocks();
});

describe('loadTiming', () => {
  it('closes a failed phase and stores the latest report once', async () => {
    vi.spyOn(console, 'table').mockImplementation(() => {});
    const listener = vi.fn();
    const unsubscribe = subscribeLoadTiming(listener);
    startLoadTiming('cloud');
    await expect(measurePhase('download', async () => { throw new Error('cancelled'); })).rejects.toThrow('cancelled');
    beginPhase('conversion');
    const report = finishLoadTiming();
    expect(report?.rows.map(row => row.phase)).toEqual(['download', 'conversion']);
    expect(getLatestLoadTiming()).toEqual(report);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
  it('keeps worker calculation distinct from handoff and round trip', () => {
    vi.spyOn(console, 'table').mockImplementation(() => {});
    startLoadTiming('cloud');
    recordPhaseDuration('handoff', 2);
    recordPhaseDuration('workerCalculation', 100);
    recordPhaseDuration('workerRoundTrip', 115);
    expect(finishLoadTiming()?.rows).toEqual([
      { phase: 'handoff', ms: 2 }, { phase: 'workerCalculation', ms: 100 }, { phase: 'workerRoundTrip', ms: 115 },
    ]);
  });
  it('records phases in order with the cache flag and reports once', () => {
    const table = vi.spyOn(console, 'table').mockImplementation(() => {});
    const log = vi.fn();
    startLoadTiming('boot');
    beginPhase('cacheRestore');
    endPhase('cacheRestore');
    setCacheHit(true);
    beginPhase('render');
    endPhase('render');

    const report = finishLoadTiming(log);
    expect(report?.source).toBe('boot');
    expect(report?.cacheHit).toBe(true);
    expect(report?.rows.map((r) => r.phase)).toEqual(['cacheRestore', 'render']);
    expect(report?.rows.every((r) => r.ms >= 0)).toBe(true);
    expect(table).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][1]).toContain('találat');

    expect(finishLoadTiming(log)).toBeNull();
    expect(table).toHaveBeenCalledTimes(1);
  });

  it('is a no-op without an active session', () => {
    expect(isLoadTimingActive()).toBe(false);
    beginPhase('download');
    endPhase('download');
    expect(finishLoadTiming()).toBeNull();
  });

  it('ignores an end without a matching begin and defaults to cache miss', () => {
    vi.spyOn(console, 'table').mockImplementation(() => {});
    startLoadTiming('cloud');
    endPhase('pipeline');
    const report = finishLoadTiming();
    expect(report?.rows).toEqual([]);
    expect(report?.cacheHit).toBe(false);
  });
});
