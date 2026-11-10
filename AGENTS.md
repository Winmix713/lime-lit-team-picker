<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## WinMix (migrated from Bolt)
- The studio UI (src/WinmixApp.tsx, views/, components/winmix/) renders client-only from src/routes/index.tsx; it depends on browser storage and Web Workers, so never render it during SSR.
- All cloud access goes through `getSupabase()`/`sessionToken()` in src/lib/cloud.ts, which wraps the generated client; never create a second Supabase client.
- WinMix RPC requests and connection summaries use that generated client's SDK, not a separate environment-derived endpoint, so reconnecting Supabase cannot split sign-in and data access across projects.
- Season uploads call the `winmix_ingest_operator` database function directly; operator rights are enforced in the database (`winmix_cloud_operators`), not in app code.
- The prediction engine runs at POST /api/public/winmix-engine and is authenticated with the managed cron helper; it is the only place that writes engine runs.
- tsconfig keeps noUncheckedIndexedAccess / exactOptionalPropertyTypes / noPropertyAccessFromIndexSignature off because the imported engine code was written without them.
- Studio cloud loads use RLS-protected embedded season/match batches and structured ingestion; preserve order and validate completeness/revision before import, and never upload cloud reads back to the cloud.
- Cloud version reads share a session-scoped in-flight request and short success cache; forced reads supersede older responses so validation never accepts a late stale result.
- Complete studio cloud loads validate embedded version fingerprints, row version IDs and expected counts, then force a final version check and retry inconsistencies once before ingestion.
- Load timing uses finally-closed phase measurements and worker-reported calculation durations; keep worker calculation separate from main-thread handoff and round-trip time.
- Bump ENGINE_VERSION in the pipeline whenever calculation logic or its dependencies change, so device results and restored forecasts cannot outlive the engine that produced them.
- Reuse per-league IndexedDB results only with a verified cloud fingerprint, engine version, match count and raw-input/settings signature; cache failures must fall back to the unchanged pipeline.

- The shared studio team picker uses the attachment-inspired portal/sheet interaction with namespaced tokens in global CSS; keep its accent isolated so other studio controls retain their theme.
- Pair-image pickers keep independent ephemeral object-URL previews per league; showing a screenshot must not import fixtures or imply persistent cloud storage.
