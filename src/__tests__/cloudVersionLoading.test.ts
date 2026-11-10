import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock('../lib/cloud', () => ({
  sessionToken: async () => null,
  getSupabase: () => ({ rpc: mocks.rpc, from: mocks.from }),
}));
import { __resetCloudVersions, fetchCloudVersions, loadConsistentCloudSeasons, type CloudVersion } from '../utils/supabaseTier';

const version: CloudVersion = { id: 'v1', versionKey: 'one', status: 'sealed', isCurrent: true,
  revision: 1, fingerprint: 'fingerprint-one', seasonCount: 1, matchCount: 1 };
const meta = { id: 's1', dataVersionId: 'v1', revision: 1, league: 'angol', seasonIndex: 1,
  sourceSeasonKey: 'one', name: 'One', fileName: 'one.csv', contentHash: 'hash', matchCount: 1,
  orderMode: 'source-order', createdAt: '2026-11-09' };
const row = { ...meta, version: { fingerprint: version.fingerprint }, matches: [{
  dataVersionId: 'v1', match_no: 1, date: null, kickoffIso: null, rowIndex: 1, sourceFileId: 's1',
  home_team: 'A', away_team: 'B', ht_home_score: null, ht_away_score: null, home_score: 1, away_score: 0,
}] };
const ok = (data: unknown) => ({ data, error: null, status: 200 });
function deferred<T>() {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}
beforeEach(() => { vi.resetAllMocks(); __resetCloudVersions(); });

describe('shared version requests', () => {
  it('sends one request for parallel callers and caches success for 3000 ms', async () => {
    let time = 0;
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => time);
    mocks.rpc.mockReturnValue({ abortSignal: async () => ok([version]) });
    await Promise.all([fetchCloudVersions(), fetchCloudVersions(), fetchCloudVersions()]);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    time = 2999; await fetchCloudVersions(); expect(mocks.rpc).toHaveBeenCalledTimes(1);
    time = 3000; await fetchCloudVersions(); expect(mocks.rpc).toHaveBeenCalledTimes(2);
    clock.mockRestore();
  });
  it('force bypasses a saved result', async () => {
    mocks.rpc.mockReturnValue({ abortSignal: async () => ok([version]) });
    await fetchCloudVersions(); await fetchCloudVersions({ force: true });
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
  });
  it('does not cache a failed request', async () => {
    mocks.rpc.mockReturnValueOnce({ abortSignal: async () => { throw new Error('network'); } })
      .mockReturnValue({ abortSignal: async () => ok([version]) });
    await expect(fetchCloudVersions()).rejects.toThrow();
    await expect(fetchCloudVersions()).resolves.toEqual([version]);
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
  });
  it('late older responses neither overwrite the cache nor reach callers as current', async () => {
    const old = deferred<ReturnType<typeof ok>>();
    const fresh = deferred<ReturnType<typeof ok>>();
    mocks.rpc.mockReturnValueOnce({ abortSignal: () => old.promise })
      .mockReturnValueOnce({ abortSignal: () => fresh.promise });
    const older = fetchCloudVersions();
    await vi.waitFor(() => expect(mocks.rpc).toHaveBeenCalledTimes(1));
    const newer = fetchCloudVersions({ force: true });
    await vi.waitFor(() => expect(mocks.rpc).toHaveBeenCalledTimes(2));
    const updated = { ...version, revision: 2 };
    fresh.resolve(ok([updated])); await newer;
    old.resolve(ok([version]));
    expect(await older).toEqual([updated]);
    expect(await fetchCloudVersions()).toEqual([updated]);
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
  });
});

function setupLoad(rows: unknown, versions: CloudVersion[][] = [[version]]) {
  let versionCall = 0;
  mocks.rpc.mockImplementation((name: string) => ({ abortSignal: async () => ok(
    name === 'winmix_cloud_versions' ? versions[Math.min(versionCall++, versions.length - 1)] : [meta],
  ) }));
  const query: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const key of ['select', 'eq', 'in', 'order', 'limit']) query[key] = vi.fn(() => query);
  query.abortSignal = vi.fn(async () => ok(rows));
  mocks.from.mockReturnValue(query);
}
describe('consistent complete downloads', () => {
  it('successful load sends exactly two version requests and one data request', async () => {
    setupLoad([row]);
    expect((await loadConsistentCloudSeasons()).downloads).toHaveLength(1);
    expect(mocks.rpc.mock.calls.filter(([name]) => name === 'winmix_cloud_versions')).toHaveLength(2);
    expect(mocks.from).toHaveBeenCalledTimes(1);
  });
  it('catches a version switched during download and retries once against fresh metadata', async () => {
    const changed = { ...version, id: 'v2', fingerprint: 'two' };
    setupLoad([row], [[version], [changed], [changed]]);
    await expect(loadConsistentCloudSeasons()).rejects.toThrow('Hiányos');
    // The retry rejects stale metadata before wasting a second download.
    expect(mocks.from).toHaveBeenCalledTimes(1);
    expect(mocks.rpc.mock.calls.filter(([name]) => name === 'winmix_cloud_versions')).toHaveLength(3);
  });
  it.each([{ rows: [] }, { rows: [{ ...row, matches: [] }] }])('retries incomplete or empty data once then errors', async ({ rows }) => {
    setupLoad(rows);
    await expect(loadConsistentCloudSeasons()).rejects.toThrow();
    expect(mocks.from).toHaveBeenCalledTimes(2);
    expect(mocks.rpc.mock.calls.filter(([name]) => name === 'winmix_cloud_versions')).toHaveLength(2);
  });
  it('rejects downloaded fingerprint mismatch', async () => {
    setupLoad([{ ...row, version: { fingerprint: 'wrong' } }]);
    await expect(loadConsistentCloudSeasons()).rejects.toThrow('Hiányos');
    expect(mocks.from).toHaveBeenCalledTimes(2);
  });
  it('retries null data once before stopping', async () => {
    setupLoad(null);
    await expect(loadConsistentCloudSeasons()).rejects.toThrow('Hiányos');
    expect(mocks.from).toHaveBeenCalledTimes(2);
  });
  it('successfully retries a newly published version rather than importing the old download', async () => {
    const changed = { ...version, id: 'v2', fingerprint: 'two' };
    setupLoad([row], [[version], [changed], [changed], [changed]]);
    let metaCall = 0;
    let versionCall = 0;
    mocks.rpc.mockImplementation((name: string) => ({ abortSignal: async () => ok(
      name === 'winmix_cloud_versions' ? [versionCall++ === 0 ? version : changed]
        : [{ ...meta, dataVersionId: metaCall++ === 0 ? 'v1' : 'v2' }],
    ) }));
    const query = mocks.from();
    query.abortSignal.mockResolvedValueOnce(ok([row])).mockResolvedValueOnce(ok([{
      ...row, dataVersionId: 'v2', version: { fingerprint: 'two' },
      matches: [{ ...row.matches[0], dataVersionId: 'v2' }],
    }]));
    mocks.from.mockClear();
    const result = await loadConsistentCloudSeasons();
    expect(result.version.id).toBe('v2');
    expect(result.downloads[0]?.meta.dataVersionId).toBe('v2');
    expect(mocks.from).toHaveBeenCalledTimes(2);
  });
  it('rejects matches from another version', async () => {
    setupLoad([{ ...row, matches: [{ ...row.matches[0], dataVersionId: 'other' }] }]);
    await expect(loadConsistentCloudSeasons()).rejects.toThrow('Hiányos');
    expect(mocks.from).toHaveBeenCalledTimes(2);
  });
  it('rejects an unexpected total season count before download', async () => {
    setupLoad([row], [[{ ...version, seasonCount: 2 }]]);
    await expect(loadConsistentCloudSeasons()).rejects.toThrow('Hiányos');
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it('rejects an unexpected total match count before download', async () => {
    setupLoad([row], [[{ ...version, matchCount: 2 }]]);
    await expect(loadConsistentCloudSeasons()).rejects.toThrow('Hiányos');
    expect(mocks.from).not.toHaveBeenCalled();
  });
});