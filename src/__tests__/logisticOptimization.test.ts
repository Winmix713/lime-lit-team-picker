/**
 * logisticOptimization — guards the zero-allocation rewrite of
 * fitMultinomialLogistic.
 *
 * The optimized implementation (flat Float64Array buffers, scalar inner loop)
 * must produce BIT-IDENTICAL weights to the naive array-of-arrays reference
 * below, which is the pre-optimization algorithm preserved verbatim. If a
 * future change alters the arithmetic (operation order, penalties, iteration
 * budget), these tests fail.
 */

import { describe, expect, it } from 'vitest';
import {
  fitMultinomialLogistic,
  predictMultinomial,
  type LogisticSample
} from '../utils/logistic';
import {
  M1_GD_ITERATIONS,
  M1_GD_LEARNING_RATE,
  M1_L2_LAMBDA,
  M1_MIN_SAMPLE
} from '../utils/constants';
import type { M1Fit } from '../types/winmix';

/* -------------------------------------------------------------------------- *
 * Reference implementation — the original naive algorithm, kept verbatim.
 * -------------------------------------------------------------------------- */

const CLASSES = 3;

function refSoftmax(z: number[]): number[] {
  const max = Math.max(z[0], z[1], z[2]);
  const e0 = Math.exp(z[0] - max);
  const e1 = Math.exp(z[1] - max);
  const e2 = Math.exp(z[2] - max);
  const s = e0 + e1 + e2;
  return [e0 / s, e1 / s, e2 / s];
}

function refStandardize(samples: readonly LogisticSample[], dim: number) {
  const mean = new Array<number>(dim).fill(0);
  const std = new Array<number>(dim).fill(0);
  for (const s of samples) {
    for (let d = 0; d < dim; d++) mean[d] += s.x[d] ?? 0;
  }
  for (let d = 0; d < dim; d++) mean[d] /= samples.length;
  for (const s of samples) {
    for (let d = 0; d < dim; d++) {
      const diff = (s.x[d] ?? 0) - mean[d];
      std[d] += diff * diff;
    }
  }
  for (let d = 0; d < dim; d++) {
    std[d] = Math.sqrt(std[d] / Math.max(1, samples.length - 1));
    if (!Number.isFinite(std[d]) || std[d] < 1e-8) std[d] = 1;
  }
  return { mean, std };
}

function refDesignRow(
  x: readonly number[],
  mean: readonly number[],
  std: readonly number[]
): number[] {
  const row = new Array<number>(mean.length + 1);
  row[0] = 1;
  for (let d = 0; d < mean.length; d++) {
    row[d + 1] = ((x[d] ?? 0) - mean[d]) / std[d];
  }
  return row;
}

function refFitMultinomialLogistic(
  samples: readonly LogisticSample[],
  lambda: number = M1_L2_LAMBDA,
  minSample: number = M1_MIN_SAMPLE,
  warmStart?: M1Fit | null
): M1Fit | null {
  const n = samples.length;
  if (n < minSample) return null;
  const dim = samples[0].x.length;
  if (dim === 0) return null;

  const { mean, std } = refStandardize(samples, dim);
  const rows = samples.map((s) => refDesignRow(s.x, mean, std));
  const width = dim + 1;

  const weights: number[][] = Array.from({ length: CLASSES }, () =>
    new Array<number>(width).fill(0)
  );

  const iterations = warmStart ? Math.max(50, Math.floor(M1_GD_ITERATIONS * 0.25)) : M1_GD_ITERATIONS;

  const grad: number[][] = Array.from({ length: CLASSES }, () =>
    new Array<number>(width).fill(0)
  );

  for (let iter = 0; iter < iterations; iter++) {
    for (let k = 0; k < CLASSES; k++) grad[k].fill(0);

    for (let i = 0; i < n; i++) {
      const row = rows[i];
      const z = [0, 0, 0];
      for (let k = 0; k < CLASSES; k++) {
        let acc = 0;
        for (let j = 0; j < width; j++) acc += weights[k][j] * row[j];
        z[k] = acc;
      }
      const p = refSoftmax(z);
      const y = samples[i].y;
      for (let k = 0; k < CLASSES; k++) {
        const err = p[k] - (k === y ? 1 : 0);
        if (err === 0) continue;
        for (let j = 0; j < width; j++) grad[k][j] += err * row[j];
      }
    }

    for (let k = 0; k < CLASSES; k++) {
      for (let j = 0; j < width; j++) {
        const penalty = j === 0 ? 0 : lambda * weights[k][j] / n;
        weights[k][j] -= M1_GD_LEARNING_RATE * (grad[k][j] / n + penalty);
      }
    }
  }

  let loss = 0;
  for (let i = 0; i < n; i++) {
    const row = rows[i];
    const z = [0, 0, 0];
    for (let k = 0; k < CLASSES; k++) {
      let acc = 0;
      for (let j = 0; j < width; j++) acc += weights[k][j] * row[j];
      z[k] = acc;
    }
    const p = refSoftmax(z);
    loss += -Math.log(Math.max(1e-9, p[samples[i].y]));
  }

  return {
    weights,
    mean,
    std,
    dim,
    n,
    lambda,
    iterations,
    avgLogLoss: loss / n
  };
}

/* -------------------------------------------------------------------------- *
 * Deterministic sample generator (mulberry32 — no Math.random).
 * -------------------------------------------------------------------------- */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSamples(n: number, dim: number, seed: number): LogisticSample[] {
  const rand = mulberry32(seed);
  const samples: LogisticSample[] = [];
  for (let i = 0; i < n; i++) {
    const x: number[] = [];
    for (let d = 0; d < dim; d++) x.push((rand() - 0.5) * 4);
    // Outcome correlated with the first feature so the fit has signal.
    const score = x[0] + (rand() - 0.5) * 2;
    const y = score > 0.5 ? 0 : score < -0.5 ? 2 : 1;
    samples.push({ x, y: y as 0 | 1 | 2 });
  }
  return samples;
}

/* -------------------------------------------------------------------------- *
 * Equivalence tests
 * -------------------------------------------------------------------------- */

describe('fitMultinomialLogistic zero-allocation equivalence', () => {
  it('produces bit-identical weights to the reference on a cold start', () => {
    const samples = makeSamples(500, 6, 42);
    const optimized = fitMultinomialLogistic(samples);
    const reference = refFitMultinomialLogistic(samples);

    expect(optimized).not.toBeNull();
    expect(reference).not.toBeNull();
    expect(optimized!.weights).toEqual(reference!.weights);
    expect(optimized!.mean).toEqual(reference!.mean);
    expect(optimized!.std).toEqual(reference!.std);
    expect(optimized!.avgLogLoss).toBe(reference!.avgLogLoss);
    expect(optimized!.iterations).toBe(reference!.iterations);
  });

  it('produces bit-identical weights to the reference on a warm start', () => {
    const samples = makeSamples(800, 6, 1337);
    const priorOptimized = fitMultinomialLogistic(samples.slice(0, 400));
    const priorReference = refFitMultinomialLogistic(samples.slice(0, 400));

    const optimized = fitMultinomialLogistic(samples, M1_L2_LAMBDA, M1_MIN_SAMPLE, priorOptimized);
    const reference = refFitMultinomialLogistic(samples, M1_L2_LAMBDA, M1_MIN_SAMPLE, priorReference);

    expect(optimized).not.toBeNull();
    expect(reference).not.toBeNull();
    expect(optimized!.weights).toEqual(reference!.weights);
    expect(optimized!.avgLogLoss).toBe(reference!.avgLogLoss);
    expect(optimized!.iterations).toBe(reference!.iterations);
  });

  it('stays bit-identical with growing samples, like the prequential refits', () => {
    const all = makeSamples(1200, 6, 7);
    let prevOptimized: M1Fit | null = null;
    let prevReference: M1Fit | null = null;
    for (let n = 200; n <= 1200; n += 200) {
      const slice = all.slice(0, n);
      prevOptimized = fitMultinomialLogistic(slice, M1_L2_LAMBDA, M1_MIN_SAMPLE, prevOptimized);
      prevReference = refFitMultinomialLogistic(slice, M1_L2_LAMBDA, M1_MIN_SAMPLE, prevReference);
      expect(prevOptimized!.weights).toEqual(prevReference!.weights);
      expect(prevOptimized!.avgLogLoss).toBe(prevReference!.avgLogLoss);
    }
  });

  it('keeps predictMultinomial outputs consistent with the fitted weights', () => {
    const samples = makeSamples(600, 6, 99);
    const fit = fitMultinomialLogistic(samples);
    expect(fit).not.toBeNull();

    const probe = [0.3, -1.2, 0.8, 0.1, -0.4, 2.0];
    const probs = predictMultinomial(fit!, probe);
    expect(probs.home).toBeGreaterThan(0);
    expect(probs.draw).toBeGreaterThan(0);
    expect(probs.away).toBeGreaterThan(0);
    expect(probs.home + probs.draw + probs.away).toBeCloseTo(1, 12);
  });

  it('still returns null below the minimum sample size', () => {
    const samples = makeSamples(M1_MIN_SAMPLE - 1, 6, 5);
    expect(fitMultinomialLogistic(samples)).toBeNull();
  });
});
