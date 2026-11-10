/**
 * logistic — regularized multinomial logistic regression, fitted from data.
 *
 * P1 MODEL CORRECTNESS
 * --------------------
 * The M1 leg of the ensemble used to run on hand-typed logit coefficients
 * (0.42 for the weight difference, 0.55 for form, …) that were never fitted to
 * anything, yet carried the majority of the ensemble weight. This module
 * replaces them with an L2-regularized softmax regression.
 *
 * DETERMINISM & LEAKAGE
 * ---------------------
 *  - Full-batch gradient descent, fixed iteration budget, no randomness: the
 *    same sample always produces the same coefficients.
 *  - The module knows nothing about time. Keeping the fit as-of is the caller's
 *    job (`utils/pipeline.ts` only ever hands it strictly-prior matches).
 *
 * PERFORMANCE
 * -----------
 *  - The fit runs on flat `Float64Array` buffers (one design matrix, one
 *    weight vector, one gradient vector) with a scalar, allocation-free inner
 *    loop. The arithmetic — operation order included — is identical to a
 *    naive array-of-arrays implementation, so the fitted weights are
 *    bit-for-bit the same; only the garbage-collector pressure is gone.
 */

import {
  M1_GD_ITERATIONS,
  M1_GD_LEARNING_RATE,
  M1_L2_LAMBDA,
  M1_MIN_SAMPLE } from
'./constants';
import type { M1Fit, Probs } from '../types/winmix';

/** Class index convention: 0 = home, 1 = draw, 2 = away. */
export type ClassIndex = 0 | 1 | 2;

export interface LogisticSample {
  /** Design vector WITHOUT the intercept — it is added internally. */
  x: number[];
  y: ClassIndex;
}

const CLASSES = 3;

function softmax(z: number[]): number[] {
  const max = Math.max(z[0], z[1], z[2]);
  const e0 = Math.exp(z[0] - max);
  const e1 = Math.exp(z[1] - max);
  const e2 = Math.exp(z[2] - max);
  const s = e0 + e1 + e2;
  return [e0 / s, e1 / s, e2 / s];
}

function standardize(samples: readonly LogisticSample[], dim: number) {
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

/** Builds the standardized design row, intercept first. */
function designRow(
x: readonly number[],
mean: readonly number[],
std: readonly number[])
: number[] {
  const row = new Array<number>(mean.length + 1);
  row[0] = 1;
  for (let d = 0; d < mean.length; d++) {
    row[d + 1] = ((x[d] ?? 0) - mean[d]) / std[d];
  }
  return row;
}

/**
 * Fits softmax weights by gradient descent on the L2-penalized mean
 * cross-entropy. Returns `null` when there is not enough prior data — the
 * caller must then fall back to the hand-set cold-start coefficients.
 */
export function fitMultinomialLogistic(
samples: readonly LogisticSample[],
lambda: number = M1_L2_LAMBDA,
minSample: number = M1_MIN_SAMPLE,
warmStart?: M1Fit | null)
: M1Fit | null {
  const n = samples.length;
  if (n < minSample) return null;
  const dim = samples[0].x.length;
  if (dim === 0) return null;

  const { mean, std } = standardize(samples, dim);
  const width = dim + 1;

  // Flat design matrix and label vector, built once per fit. Row i starts at
  // i * width; column 0 is the intercept. The fill formula is exactly
  // designRow's, so every standardized value is bit-identical.
  const rows = new Float64Array(n * width);
  const labels = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const base = i * width;
    const x = samples[i].x;
    rows[base] = 1;
    for (let d = 0; d < dim; d++) {
      rows[base + 1 + d] = ((x[d] ?? 0) - mean[d]) / std[d];
    }
    labels[i] = samples[i].y;
  }

  const iterations = warmStart ? Math.max(50, Math.floor(M1_GD_ITERATIONS * 0.25)) : M1_GD_ITERATIONS;

  // Flat weight and gradient buffers: class k starts at k * width.
  const w = new Float64Array(CLASSES * width);
  const grad = new Float64Array(CLASSES * width);
  const w1 = width;
  const w2 = 2 * width;

  for (let iter = 0; iter < iterations; iter++) {
    grad.fill(0);

    for (let i = 0; i < n; i++) {
      const base = i * width;
      // Each z_k accumulates over j in the same order as the naive
      // per-class loop, so the sums are bit-identical.
      let z0 = 0;
      let z1 = 0;
      let z2 = 0;
      for (let j = 0; j < width; j++) {
        const r = rows[base + j];
        z0 += w[j] * r;
        z1 += w[w1 + j] * r;
        z2 += w[w2 + j] * r;
      }
      const max = Math.max(z0, z1, z2);
      const e0 = Math.exp(z0 - max);
      const e1 = Math.exp(z1 - max);
      const e2 = Math.exp(z2 - max);
      const s = e0 + e1 + e2;
      const y = labels[i];

      const err0 = e0 / s - (y === 0 ? 1 : 0);
      if (err0 !== 0) {
        for (let j = 0; j < width; j++) grad[j] += err0 * rows[base + j];
      }
      const err1 = e1 / s - (y === 1 ? 1 : 0);
      if (err1 !== 0) {
        for (let j = 0; j < width; j++) grad[w1 + j] += err1 * rows[base + j];
      }
      const err2 = e2 / s - (y === 2 ? 1 : 0);
      if (err2 !== 0) {
        for (let j = 0; j < width; j++) grad[w2 + j] += err2 * rows[base + j];
      }
    }

    for (let k = 0; k < CLASSES; k++) {
      const kb = k * width;
      for (let j = 0; j < width; j++) {
        // The intercept (j = 0) is deliberately left unpenalized.
        const penalty = j === 0 ? 0 : lambda * w[kb + j] / n;
        w[kb + j] -= M1_GD_LEARNING_RATE * (grad[kb + j] / n + penalty);
      }
    }
  }

  let loss = 0;
  for (let i = 0; i < n; i++) {
    const base = i * width;
    let z0 = 0;
    let z1 = 0;
    let z2 = 0;
    for (let j = 0; j < width; j++) {
      const r = rows[base + j];
      z0 += w[j] * r;
      z1 += w[w1 + j] * r;
      z2 += w[w2 + j] * r;
    }
    const max = Math.max(z0, z1, z2);
    const e0 = Math.exp(z0 - max);
    const e1 = Math.exp(z1 - max);
    const e2 = Math.exp(z2 - max);
    const s = e0 + e1 + e2;
    const y = labels[i];
    const py = y === 0 ? e0 / s : y === 1 ? e1 / s : e2 / s;
    loss += -Math.log(Math.max(1e-9, py));
  }

  const weights: number[][] = Array.from({ length: CLASSES }, (_, k) =>
  Array.from(w.subarray(k * width, (k + 1) * width))
  );

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

/** Applies a fit to one design vector. */
export function predictMultinomial(fit: M1Fit, x: readonly number[]): Probs {
  const row = designRow(x, fit.mean, fit.std);
  const z = [0, 0, 0];
  for (let k = 0; k < CLASSES; k++) {
    let acc = 0;
    for (let j = 0; j < row.length; j++) acc += fit.weights[k][j] * row[j];
    z[k] = acc;
  }
  const p = softmax(z);
  return { home: p[0], draw: p[1], away: p[2] };
}

/**
 * Grid-searches the ensemble weight given to M1, minimizing log-loss on
 * strictly prior data. The band is deliberately narrow: the point is to nudge
 * a hand-set constant, not to let one noisy season swing the whole model.
 */
export function fitEnsembleWeight(
samples: readonly {b1: Probs;m1: Probs;y: ClassIndex;}[],
min: number,
max: number,
fallback: number,
minSample: number)
: {wM1: number;avgLogLoss: number;n: number;} | null {
  if (samples.length < minSample) return null;
  let best = fallback;
  let bestLoss = Infinity;
  for (let w = min; w <= max + 1e-9; w += 0.05) {
    let loss = 0;
    for (const s of samples) {
      const blended = [
      (1 - w) * s.b1.home + w * s.m1.home,
      (1 - w) * s.b1.draw + w * s.m1.draw,
      (1 - w) * s.b1.away + w * s.m1.away];

      loss += -Math.log(Math.max(1e-6, blended[s.y]));
    }
    if (loss < bestLoss) {
      bestLoss = loss;
      best = w;
    }
  }
  return {
    wM1: parseFloat(best.toFixed(2)),
    avgLogLoss: bestLoss / samples.length,
    n: samples.length
  };
}
