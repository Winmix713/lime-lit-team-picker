import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), sessionToken: vi.fn() }));
vi.mock('../lib/cloud', () => ({
  sessionToken: mocks.sessionToken,
  getSupabase: () => ({
    rpc: mocks.rpc,
    storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: 'https://dpmyxypqcsugycqhifaf.supabase.co/storage/v1/object/public/winmix-incoming/' } }) }) },
  }),
}));
import { cloudEndpointSummary, cloudRequest, probeCloudTier } from '../utils/supabaseTier';

afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
describe('connected Supabase RPC transport', () => {
  it('uses the sign-in client instead of a stale environment endpoint', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://obsolete.lovable.cloud');
    const abortSignal = vi.fn().mockResolvedValue({ data: { contract: 2, canWrite: false }, error: null, status: 200 });
    mocks.rpc.mockReturnValue({ abortSignal });
    expect(cloudEndpointSummary().url).toBe('https://dpmyxypqcsugycqhifaf.supabase.co');
    await expect(cloudRequest('rest/v1/rpc/winmix_cloud_access', {})).resolves.toEqual({ contract: 2, canWrite: false });
    expect(mocks.rpc).toHaveBeenCalledWith('winmix_cloud_access', {});
    expect(abortSignal).toHaveBeenCalledWith(expect.any(AbortSignal));
  });
  it('reads access and versions using the versioned contract', async () => {
    mocks.rpc.mockImplementation((name: string) => ({ abortSignal: () => Promise.resolve({
      data: name === 'winmix_cloud_access' ? { contract: 2, canWrite: false } : [], error: null, status: 200,
    }) }));
    expect((await probeCloudTier()).status).toBe('online');
    expect(mocks.rpc.mock.calls.map(([name]) => name)).toEqual(['winmix_cloud_access', 'winmix_cloud_versions']);
  });
  it('does not send an upload when sign-in is required and missing', async () => {
    mocks.sessionToken.mockRejectedValueOnce(new Error('Sign-in required'));
    await expect(cloudRequest('rest/v1/rpc/winmix_ingest_operator', {}, true)).rejects.toThrow('Sign-in required');
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});