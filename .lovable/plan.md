# Instant reopen: cache finished calculations on the device

## Goal
First open stays ~40 s on phone, but every later open with unchanged data finishes in about 1-3 s. Results are identical, because nothing is recalculated differently - finished results are just reused.

## How it works
1. After a full load finishes, the calculated results for each league are saved in the browser's local storage (IndexedDB), labelled with the cloud data version fingerprint and the engine version.
2. On the next open, after the quick version check (~0.6 s), if the fingerprint and engine version match, the saved results are shown directly and the calculation step is skipped.
3. If the cloud data changed, or the engine code changed, the cache is ignored and a normal full calculation runs, then the cache is refreshed.
4. The status bar shows a new line, "Gyorsítótár: találat / kihagyva", so you can see which path ran.

## Technical details
- New `src/utils/resultCache.ts`: IndexedDB store keyed by league; entry = { fingerprint, engineVersion, matchCount, results }. Corrupt or unreadable entries are deleted and treated as a miss.
- `ENGINE_VERSION` constant next to the pipeline; bump it whenever calculation logic changes (rule added to AGENTS.md).
- Hook into `usePipelineRunner`/`pipelineRunner.ts`: check the cache before sending work to the worker; write after success.
- New load-timing phase `cacheRead` and cache hit/miss flag in the StatusBar.
- Tests: hit with matching fingerprint, miss on changed fingerprint, miss on changed engine version, cached output deep-equals fresh output.
- Verify with Playwright: second reload skips worker calculation.

## Not included
Less frequent refits / early stopping would change results slightly, so they are left out.
