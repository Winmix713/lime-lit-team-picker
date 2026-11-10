import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ from: vi.fn(), rpc: vi.fn(), sessionToken: vi.fn(), abortSignal: vi.fn() }));
vi.mock('../lib/cloud', () => ({
  sessionToken: mocks.sessionToken,
  getSupabase: () => ({ from: mocks.from, rpc: mocks.rpc }),
}));
import { __resetCloudVersions, fetchCloudSeasonsBatched, type CloudSeasonMeta } from '../utils/supabaseTier';

const meta = (index: number): CloudSeasonMeta => ({
  id: `season-${index}`, dataVersionId: 'version-1', revision: 1, league: 'angol',
  seasonIndex: index, sourceSeasonKey: `angol-${index}`, name: `Season ${index}`,
  fileName: `angol-${index}.csv`, contentHash: `hash-${index}`, matchCount: 240,
  orderMode: 'source-order', createdAt: '2026-11-09T00:00:00Z',
});
const row = (meta: CloudSeasonMeta) => {
  const { revision: _revision, ...fields } = meta;
  return { ...fields, version: { fingerprint: null }, matches: Array.from({ length: 240 }, (_, index) => ({
    dataVersionId: meta.dataVersionId,
    match_no: index + 1, date: null, kickoffIso: null, rowIndex: index + 1,
    sourceFileId: meta.id, home_team: 'Liverpool', away_team: 'Chelsea',
    ht_home_score: null, ht_away_score: null, home_score: index % 3, away_score: 0,
  })).reverse() };
};

beforeEach(() => {
  vi.resetAllMocks();
  __resetCloudVersions();
  const query = { select: vi.fn(), eq: vi.fn(), in: vi.fn(), order: vi.fn(), limit: vi.fn(), abortSignal: mocks.abortSignal };
  for (const key of ['select', 'eq', 'in', 'order', 'limit'] as const) query[key].mockReturnValue(query);
  mocks.from.mockReturnValue(query);
  mocks.rpc.mockReturnValue({ abortSignal: () => Promise.resolve({
    data: [{ id: 'version-1', versionKey: 'one', revision: 1, status: 'sealed',
      isCurrent: true, fingerprint: null, seasonCount: 103, matchCount: 24720 }],
    error: null, status: 200,
  }) });
});

describe('structured cloud batch loading', () => {
  it('loads 103 seasons and 24720 matches in one data request without CSV conversion', async () => {
    const metas = Array.from({ length: 103 }, (_, index) => meta(index));
    mocks.abortSignal.mockResolvedValue({ data: metas.map(row).reverse(), error: null, status: 200 });
    const progress = vi.fn();
    const result = await fetchCloudSeasonsBatched(metas, { onProgress: progress });
    expect(mocks.from).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(result.map(season => season.meta.id)).toEqual(metas.map(season => season.id));
    expect(result.flatMap(season => season.matches)).toHaveLength(24720);
    expect(result[0]?.matches[0]?.match_no).toBe(1);
    expect(result[0]).not.toHaveProperty('csvText');
    expect(progress).toHaveBeenLastCalledWith(103, 103);
  });
  it('splits larger datasets into bounded batches', async () => {
    const metas = Array.from({ length: 201 }, (_, index) => meta(index));
    mocks.abortSignal.mockResolvedValueOnce({ data: metas.slice(0, 200).map(row), error: null, status: 200 })
      .mockResolvedValueOnce({ data: metas.slice(200).map(row), error: null, status: 200 });
    expect(await fetchCloudSeasonsBatched(metas)).toHaveLength(201);
    expect(mocks.from).toHaveBeenCalledTimes(2);
  });
  it('rejects truncated match lists instead of importing partial data', async () => {
    const data = row(meta(1));
    data.matches.pop();
    mocks.abortSignal.mockResolvedValue({ data: [data], error: null, status: 200 });
    await expect(fetchCloudSeasonsBatched([meta(1)])).rejects.toThrow('Hiányos');
  });
  it('rejects missing seasons', async () => {
    mocks.abortSignal.mockResolvedValue({ data: [], error: null, status: 200 });
    await expect(fetchCloudSeasonsBatched([meta(1)])).rejects.toThrow('Hiányzó');
  });
  it('rejects a changed version before returning any data', async () => {
    mocks.abortSignal.mockResolvedValue({ data: [row(meta(1))], error: null, status: 200 });
    mocks.rpc.mockReturnValue({ abortSignal: () => Promise.resolve({ data: [], error: null, status: 200 }) });
    await expect(fetchCloudSeasonsBatched([meta(1)])).rejects.toThrow('megváltozott');
  });
  it('does not fall back to 103 requests when permission is denied', async () => {
    mocks.abortSignal.mockResolvedValue({ data: null, error: { code: '42501' }, status: 403 });
    await expect(fetchCloudSeasonsBatched([meta(1)])).rejects.toMatchObject({ status: 403 });
    expect(mocks.from).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});