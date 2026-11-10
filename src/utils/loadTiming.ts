/**
 * Phase timing for the load path (cloud download or boot/cache restore).
 * Pure instrumentation: never changes behaviour, never throws, no-ops when
 * no session is active. One `console.table` + one diagnostics entry per load.
 */
export type LoadPhase = 'version' | 'download' | 'dataCheck' | 'conversion' | 'handoff' | 'workerCalculation' | 'workerRoundTrip' | 'inlineCalculation' | 'pipeline' | 'cacheRestore' | 'cacheRead' | 'render';
export type LoadSource = 'cloud' | 'boot';
export type TimingLogger = (level: 'info', message: string) => void;

export interface LoadTimingRow {
  phase: LoadPhase;
  ms: number;
}

export interface LoadTimingReport {
  source: LoadSource;
  cacheHit: boolean;
  totalMs: number;
  resultCacheHit: boolean;
  rows: LoadTimingRow[];
}

interface Session {
  id: number;
  source: LoadSource;
  startedAt: number;
  open: Map<LoadPhase, number>;
  rows: LoadTimingRow[];
  cacheHit: boolean;
  finished: boolean;
  resultCacheChecks: boolean[];
}

let current: Session | null = null;
let seq = 0;
let latest: LoadTimingReport | null = null;
const listeners = new Set<() => void>();
export const getLatestLoadTiming = () => latest;
export const subscribeLoadTiming = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export function recordPhaseDuration(phase: LoadPhase, ms: number): void {
  if (current && !current.finished && Number.isFinite(ms) && ms >= 0) current.rows.push({ phase, ms: Math.round(ms * 10) / 10 });
}
export async function measurePhase<T>(phase: LoadPhase, operation: () => Promise<T>): Promise<T> {
  const session = current;
  const started = now();
  try { return await operation(); }
  finally { if (current === session) recordPhaseDuration(phase, now() - started); }
}

const now = (): number =>
  typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now();

function safePerf(fn: (p: Performance) => void): void {
  try {
    if (typeof performance !== 'undefined' && typeof performance.mark === 'function') fn(performance);
  } catch {
    // Instrumentation must never break the load.
  }
}

/** Starts a new load session (replacing any unfinished one). */
export function startLoadTiming(source: LoadSource): void {
  seq += 1;
  current = { id: seq, source, startedAt: now(), open: new Map(), rows: [], cacheHit: false, finished: false, resultCacheChecks: [] };
  safePerf((p) => p.mark(`winmix:${seq}:start`));
}

export function isLoadTimingActive(): boolean {
  return current !== null && !current.finished;
}

export function beginPhase(phase: LoadPhase): void {
  const s = current;
  if (!s || s.finished) return;
  s.open.set(phase, now());
  safePerf((p) => p.mark(`winmix:${s.id}:${phase}:start`));
}

export function endPhase(phase: LoadPhase): void {
  const s = current;
  if (!s || s.finished) return;
  const started = s.open.get(phase);
  if (started === undefined) return;
  s.open.delete(phase);
  s.rows.push({ phase, ms: Math.round((now() - started) * 10) / 10 });
  safePerf((p) => {
    p.mark(`winmix:${s.id}:${phase}:end`);
    p.measure(`winmix:${phase}`, `winmix:${s.id}:${phase}:start`, `winmix:${s.id}:${phase}:end`);
  });
}

export function setCacheHit(hit: boolean): void {
  if (current && !current.finished) current.cacheHit = hit;
}

export function recordResultCacheHit(hit: boolean): void {
  if (current && !current.finished) current.resultCacheChecks.push(hit);
}

/** Closes the session and reports it once. Returns the report (or null if none). */
export function finishLoadTiming(log?: TimingLogger): LoadTimingReport | null {
  const s = current;
  if (!s || s.finished) return null;
  for (const phase of [...s.open.keys()]) endPhase(phase);
  s.finished = true;
  const report: LoadTimingReport = {
    source: s.source,
    cacheHit: s.cacheHit,
    resultCacheHit: s.resultCacheChecks.length > 0 && s.resultCacheChecks.every(Boolean),
    totalMs: Math.round((now() - s.startedAt) * 10) / 10,
    rows: [...new Set(s.rows.map(row => row.phase))].map(phase => ({
      phase, ms: Math.round(s.rows.filter(row => row.phase === phase).reduce((sum, row) => sum + row.ms, 0) * 10) / 10,
    }))
  };
  latest = report;
  for (const listener of listeners) listener();
  try {
    console.table([
      ...report.rows.map((r) => ({ phase: r.phase, ms: r.ms })),
      { phase: `total (${report.source}, cache ${report.cacheHit ? 'HIT' : 'miss'})`, ms: report.totalMs }
    ]);
    log?.(
      'info',
      `Betöltési idők (${report.source}, IndexedDB cache: ${report.cacheHit ? 'találat' : 'nincs'}): ` +
        report.rows.map((r) => `${r.phase} ${r.ms} ms`).join(' · ') +
        ` · összesen ${report.totalMs} ms`
    );
  } catch {
    // ignore
  }
  return report;
}

/** Measures commit → next painted frame as the 'render' phase, then finishes. */
export function finishAfterRender(log?: TimingLogger): void {
  if (!isLoadTimingActive()) return;
  const session = current;
  beginPhase('render');
  const done = () => {
    if (current !== session) return;
    endPhase('render');
    finishLoadTiming(log);
  };
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(done));
  } else {
    setTimeout(done, 0);
  }
}

/** Test helper. */
export function __resetLoadTiming(): void {
  current = null;
  latest = null;
}
