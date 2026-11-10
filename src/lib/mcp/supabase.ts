import { createClient } from "@supabase/supabase-js";

type RuntimeGlobals = typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};

function env(names: string[]): string | undefined {
  const e = (globalThis as RuntimeGlobals).process?.env;
  for (const n of names) {
    const v = e?.[n]?.trim();
    if (v) return v;
  }
  return undefined;
}

export function supabaseAnon() {
  const url = env(["SUPABASE_URL", "VITE_SUPABASE_URL"]);
  const key = env(["SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY"]);
  if (!url || !key) throw new Error("Backend configuration is missing");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Calls a public read-only database function and returns its JSON result. */
export async function publicRpc(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
  const { data, error } = await supabaseAnon().rpc(name as never, args as never);
  if (error) throw new Error(error.message);
  return data;
}

export async function currentVersionId(): Promise<string | null> {
  const versions = (await publicRpc("winmix_cloud_versions")) as Array<{ id: string; isCurrent: boolean; status: string }> | null;
  return versions?.find((v) => v.isCurrent && v.status === "sealed")?.id ?? null;
}
