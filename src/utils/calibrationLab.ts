/**
 * Kalibrációs labor — a teljes mérkőzésállomány 1X2 és BTTS visszamérése.
 *
 * Tiszta függvények: a motor kimenetét NEM írja át. Egy időrendi tanuló
 * szeletre (alapból az első 70%) sávonkénti korrekciót illeszt, majd a
 * fennmaradó, sosem látott 30%-on méri, hogy a korrekció javít-e (Brier).
 */
import { wilsonInterval } from './bootstrap';
import { BAND_MIN_SAMPLE } from './constants';
import type { BandDiagnosis, MatchRow, Outcome, Probs } from '../types/winmix';

export type CalibrationMarket = '1x2' | 'btts';

export interface ProbObservation {
  /** A modell által jelzett valószínűség a vizsgált kimenetre. */
  p: number;
  /** Bejött-e a kimenet. */
  hit: boolean;
}

export interface ProbBand {
  key: string;
  label: string;
  range: string;
  n: number;
  hits: number;
  avgP: number;
  hitRate: number;
  gap: number;
  ciLo: number;
  ciHi: number;
  evaluable: boolean;
  diagnosis: BandDiagnosis;
  /** Zsugorított korrekció (tényleges − jelzett), pp nélkül, 0..1 skálán. */
  offset: number;
}

export interface CalibrationMap {
  edges: number[];
  offsets: number[];
}

export interface CalibrationReport {
  market: CalibrationMarket;
  total: number;
  trainN: number;
  testN: number;
  bands: ProbBand[];
  map: CalibrationMap;
  brierRaw: number | null;
  brierCalibrated: number | null;
  /** Pozitív = a korrekció javított a független teszt-szeleten. */
  improvementPct: number | null;
}

/** Sávhatárok: [0,.3) [.3,.4) … [.8,1]. */
export const PROB_EDGES = [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0001];
/** Ennyi eset kell, hogy egy sáv korrekciója fél súlyt kapjon. */
export const OFFSET_SHRINK_K = 50;

function diagnose(n: number, avgP: number, lo: number, hi: number): BandDiagnosis {
  if (n < BAND_MIN_SAMPLE) return 'insufficient';
  if (avgP >= lo && avgP <= hi) return 'calibrated';
  return avgP > hi ? 'overconfident' : 'underconfident';
}

function bandIndex(p: number, edges: readonly number[]): number {
  for (let i = 0; i < edges.length - 1; i += 1) {
    if (p >= (edges[i] as number) && p < (edges[i + 1] as number)) return i;
  }
  return edges.length - 2;
}

const pctLabel = (v: number) => `${Math.round(Math.min(v, 1) * 100)}%`;

export function computeProbBands(
  obs: readonly ProbObservation[],
  edges: readonly number[] = PROB_EDGES
): ProbBand[] {
  const buckets = Array.from({ length: edges.length - 1 }, () => ({ n: 0, hits: 0, sumP: 0 }));
  obs.forEach((o) => {
    const b = buckets[bandIndex(o.p, edges)]!;
    b.n += 1;
    b.sumP += o.p;
    if (o.hit) b.hits += 1;
  });
  return buckets.map((b, i) => {
    const lo = edges[i] as number;
    const hi = edges[i + 1] as number;
    const avgP = b.n ? b.sumP / b.n : 0;
    const hitRate = b.n ? b.hits / b.n : 0;
    const ci = wilsonInterval(b.hits, b.n);
    const weight = b.n / (b.n + OFFSET_SHRINK_K);
    return {
      key: `b${i}`,
      label: i === buckets.length - 1 ? `${pctLabel(lo)}+` : `${pctLabel(lo)}–${pctLabel(hi)}`,
      range: `${b.n ? (avgP * 100).toFixed(0) : '—'}% átlag`,
      n: b.n,
      hits: b.hits,
      avgP,
      hitRate,
      gap: avgP - hitRate,
      ciLo: ci.lo,
      ciHi: ci.hi,
      evaluable: b.n >= BAND_MIN_SAMPLE,
      diagnosis: diagnose(b.n, avgP, ci.lo, ci.hi),
      offset: b.n ? (hitRate - avgP) * weight : 0
    };
  });
}

export function fitCalibrationMap(
  obs: readonly ProbObservation[],
  edges: readonly number[] = PROB_EDGES
): CalibrationMap {
  return { edges: [...edges], offsets: computeProbBands(obs, edges).map((b) => b.offset) };
}

export function applyCalibration(p: number, map: CalibrationMap): number {
  const offset = map.offsets[bandIndex(p, map.edges)] ?? 0;
  return Math.min(0.99, Math.max(0.01, p + offset));
}

function brier(obs: readonly ProbObservation[], f: (p: number) => number): number | null {
  if (!obs.length) return null;
  return obs.reduce((a, o) => a + (f(o.p) - (o.hit ? 1 : 0)) ** 2, 0) / obs.length;
}

export function buildCalibrationReport(
  market: CalibrationMarket,
  obs: readonly ProbObservation[],
  trainShare = 0.7
): CalibrationReport {
  const trainN = Math.floor(obs.length * trainShare);
  const train = obs.slice(0, trainN);
  const test = obs.slice(trainN);
  const map = fitCalibrationMap(train);
  const brierRaw = brier(test, (p) => p);
  const brierCalibrated = brier(test, (p) => applyCalibration(p, map));
  return {
    market,
    total: obs.length,
    trainN,
    testN: test.length,
    bands: computeProbBands(obs),
    map,
    brierRaw,
    brierCalibrated,
    improvementPct:
      brierRaw && brierCalibrated !== null ? (1 - brierCalibrated / brierRaw) * 100 : null
  };
}

export function topPickOf(probs: Probs): { outcome: Outcome; p: number } {
  const list: Array<{ outcome: Outcome; p: number }> = [
    { outcome: 'H', p: probs.home },
    { outcome: 'D', p: probs.draw },
    { outcome: 'A', p: probs.away }
  ];
  return list.reduce((best, x) => (x.p > best.p ? x : best), list[0]!);
}

/** BTTS: a modell BTTS Igen valószínűsége a valós BTTS ellen. */
export function bttsObservations(matches: readonly MatchRow[]): ProbObservation[] {
  const out: ProbObservation[] = [];
  matches.forEach((m) => {
    const p = m.pipeline?.secondary?.btts;
    if (typeof p === 'number' && Number.isFinite(p)) out.push({ p, hit: m.btts });
  });
  return out;
}

/** 1X2: a kalibrált csúcstipp valószínűsége a valós kimenet ellen. */
export function oneXTwoObservations(matches: readonly MatchRow[]): ProbObservation[] {
  const out: ProbObservation[] = [];
  matches.forEach((m) => {
    if (!m.pipeline?.calibrated) return;
    const pick = topPickOf(m.pipeline.calibrated);
    out.push({ p: pick.p, hit: pick.outcome === m.outcome });
  });
  return out;
}
