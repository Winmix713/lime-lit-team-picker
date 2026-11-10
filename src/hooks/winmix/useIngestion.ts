import { useCallback, useState, type MutableRefObject } from 'react';
import { toast } from 'sonner';
import type { LeagueMode } from '../../types/winmix';
import { syncSeasonsToCloud } from '../../utils/cloudSync';
import { endPhase, measurePhase, finishAfterRender } from '../../utils/loadTiming';
import { READ_CONCURRENCY } from '../../utils/constants';
import { readFilesWithConcurrency } from '../../utils/csv';
import { isCloudTierConfigured } from '../../utils/supabaseTier';
import { applyRecommendedTeamWeights, errorMessage, pct } from './helpers';
import { ingestSources, type IngestSource } from './ingest';
import { makeSourceFileId } from './helpers';
import type { DomainState, UploadResult } from './types';
import type { LogDiagnostic } from './useDiagnostics';
import type { PipelineRunner } from './usePipelineRunner';

interface IngestionDeps {
  stateRef: MutableRefObject<DomainState>;
  commit: (patch: Partial<DomainState>) => DomainState;
  persist: (snapshot: DomainState) => void;
  logDiagnostic: LogDiagnostic;
  resetWeightDraft: () => void;
  runner: Pick<PipelineRunner, 'report' | 'isStale' | 'withPipelineLock' | 'runPipelineForLeagues'>;
}

/**
 * CSV import: bounded-concurrency read → pure parse/validate/dedupe →
 * recommended weights → pipeline for the touched leagues → commit/persist →
 * optional silent cloud sync.
 */
export function useIngestion({
  stateRef,
  commit,
  persist,
  logDiagnostic,
  resetWeightDraft,
  runner
}: IngestionDeps) {
  const { report, isStale, withPipelineLock, runPipelineForLeagues } = runner;
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const dismissUploadResult = useCallback(() => setUploadResult(null), []);

  /**
   * Shared ingestion: either reads CSV files from disk, or takes structured
   * season rows (cloud JSON) directly — the latter skips CSV serialisation,
   * File wrapping, FileReader and CSV tokenising altogether.
   */
  const ingest = useCallback(
    async (
      load: (runId: number) => Promise<IngestSource[] | null>,
      mode: LeagueMode,
      fromCloud = false,
      fingerprint?: string
    ) => {
      const completed = await withPipelineLock(async (runId) => {
        setUploadResult(null);

        try {
          const sources = await load(runId);
          if (!sources || isStale(runId)) return false;
          const total = sources.length;

          // Phase 2 (60–90%): pure parse/validate/dedupe.
          const snapshot = stateRef.current;
          const ingest = ingestSources(
            {
              seasons: snapshot.seasons,
              teamWeights: snapshot.teamWeights,
              teamAliasMap: snapshot.teamAliasMap,
              seasonCounters: snapshot.seasonCounters,
              allowDuplicateImport: snapshot.settings.allowDuplicateImport
            },
            sources,
            mode,
            (source, index) => {
              report({
                label: `Feldolgozás: ${source.name} (${index + 1}/${total})`,
                pct: 60 + ((index + 1) / total) * 30
              });
            }
          );
          if (isStale(runId)) return false;

          let working: DomainState = {
            ...snapshot,
            seasons: ingest.seasons,
            teamWeights: ingest.teamWeights,
            teamAliasMap: ingest.teamAliasMap,
            seasonCounters: ingest.seasonCounters
          };

          // Every accepted English/Spanish import activates the system's
          // recommendation before forecasts are rebuilt. Both supported leagues
          // share this path, whether they were selected or auto-detected.
          if (ingest.leaguesTouched.length > 0) {
            working = applyRecommendedTeamWeights(working, ingest.leaguesTouched);
            ingest.warnings.push(
              `ℹ️ A rendszer „Javasolt” csapatsúlyai automatikusan alkalmazva: ${ingest.leaguesTouched.join(', ')}.`
            );
          }
          if (fromCloud && sources.some(source => !ingest.seasons.some(season => season.fileName === source.name))) {
            throw new Error('Nem sikerült minden felhős szezont feldolgozni.');
          }

          endPhase('conversion');

          // Phase 3 (90–100%): recompute only the leagues we actually touched.
          if (ingest.leaguesTouched.length > 0) {
            report({ label: 'Pipeline (as-of) számítás…', pct: 90 }, true);
            working = await measurePhase('pipeline', () => runPipelineForLeagues(
              ingest.leaguesTouched,
              working,
              'Pipeline (as-of) számítás',
              { fingerprint }
            ));
            if (isStale(runId)) return false;
          }

          resetWeightDraft();
          persist(commit(working));
          finishAfterRender(logDiagnostic);
          setUploadResult({ added: ingest.added, warnings: ingest.warnings });
          for (const w of ingest.warnings) {
            logDiagnostic(w.startsWith('⚠️') ? 'warn' : 'info', w);
          }

          if (ingest.added > 0) {
            toast.success(`${ingest.added} új bajnokság rögzítve!`);
            // Auto-sync to Supabase if the cloud tier is configured — silent,
            // non-blocking, failure only logs a diagnostic entry.
            if (!fromCloud && isCloudTierConfigured()) {
              const synced = working;
              void (async () => {
                try {
                  const result = await syncSeasonsToCloud(
                    synced.seasons,
                    synced.teamWeights,
                    synced.teamAliasMap
                  );
                  if (result.success) {
                    logDiagnostic(
                      'info',
                      `Felhő szinkron: ${result.seasons} szezon, ${result.teams} csapat, ${result.matches} mérkőzés feltöltve.`
                    );
                  } else {
                    logDiagnostic(
                      'warn',
                      `Felhő szinkron sikertelen: ${result.errors.join('; ')}`
                    );
                  }
                } catch (e) {
                  logDiagnostic('warn', `Felhő szinkron hiba: ${errorMessage(e)}`);
                }
              })();
            }
          } else {
            toast.error(
              'Egyetlen fájl sem került rögzítésre — nézd meg a figyelmeztetéseket.'
            );
          }
          return true;
        } catch (e) {
          logDiagnostic('error', `Import hiba: ${errorMessage(e)}`);
          toast.error('Az import hibára futott — részletek a diagnosztikai naplóban.');
          if (fromCloud) throw e;
          return false;
        }
      });
      if (fromCloud && !completed) throw new Error('A felhőimport nem fejeződött be; próbáld újra.');
    },
    [
      commit,
      isStale,
      logDiagnostic,
      persist,
      report,
      resetWeightDraft,
      runPipelineForLeagues,
      stateRef,
      withPipelineLock
    ]
  );

  const importFiles = useCallback(
    async (fileList: FileList | File[], mode: LeagueMode) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;
      await ingest(async (runId) => {
        report({ label: `Fájlok beolvasása… 0/${files.length}`, pct: 0 }, true);
        // Phase 1 (0–60%): bounded-concurrency disk reads.
        const texts = await readFilesWithConcurrency(
          files,
          READ_CONCURRENCY,
          (done, total) => {
            report({
              label: `Fájlok beolvasása… ${done}/${total}`,
              pct: pct(done, total) * 0.6
            });
          },
          (message) => logDiagnostic('error', message)
        );
        if (isStale(runId)) return null;
        return files.map((file, i) => ({
          name: file.name,
          sourceFileId: makeSourceFileId(file),
          text: texts[i] ?? null
        }));
      }, mode);
    },
    [ingest, isStale, logDiagnostic, report]
  );

  /** Structured seasons (e.g. cloud JSON) straight into the ingest pipeline. */
  const importStructuredSeasons = useCallback(
    async (sources: IngestSource[], mode: LeagueMode, fingerprint?: string) => {
      if (sources.length === 0) return;
      await ingest(async () => {
        report({ label: `Feldolgozás… 0/${sources.length}`, pct: 60 }, true);
        return sources;
      }, mode, true, fingerprint);
    },
    [ingest, report]
  );

  return { uploadResult, importFiles, importStructuredSeasons, dismissUploadResult };
}
