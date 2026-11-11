import { describe, expect, it } from 'vitest';
import { applyCalibration, buildCalibrationReport, computeProbBands, fitCalibrationMap } from './calibrationLab';

const make = (p: number, n: number, hits: number) =>
  Array.from({ length: n }, (_, i) => ({ p, hit: i < hits }));

describe('calibrationLab', () => {
  it('a 70%-ot jelző, de csak 50%-ban bejövő sáv túlmagabiztos', () => {
    const band = computeProbBands(make(0.72, 200, 100)).find((b) => b.n > 0)!;
    expect(band.hitRate).toBeCloseTo(0.5);
    expect(band.diagnosis).toBe('overconfident');
  });

  it('a korrekció a tényleges beválás felé húz, mintamérettel zsugorítva', () => {
    const map = fitCalibrationMap(make(0.72, 200, 100));
    // offset = (0.5 - 0.72) * 200/250 = -0.176
    expect(applyCalibration(0.72, map)).toBeCloseTo(0.544, 3);
  });

  it('a független teszt-szeleten javítja a Brier-t, ha a torzítás tartós', () => {
    const report = buildCalibrationReport('btts', make(0.72, 1000, 500).sort(() => 0));
    expect(report.testN).toBe(300);
    expect(report.improvementPct!).toBeGreaterThan(0);
  });
});
