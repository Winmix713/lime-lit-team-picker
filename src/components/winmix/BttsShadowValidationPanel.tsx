import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { Collapsible } from './Collapsible';
import { EmptyRow, Table, TableScroll, Td, Th, Tr } from './DataTable';
import { SectionHeading } from './Panel';
import type { CoreTraceCandidate, CoreTraceLevelTally, CoreTracePopulations } from '../../utils/coreTrace';

interface ShadowVerdictRecord {
  id: string;
  roundId: string;
  fixtureId: string;
  fixtureLabel: string;
  modelProb: number | null;
  stability: number;
  marketConfidence: number;
  liveQuadrant: string;
  shadowQuadrant: string;
  relaxedBy: string[];
  liveGateFailures: string[];
  evidenceLevel: string;
  bandDiagnosis: string;
  actualBtts: boolean | null;
  actualOutcome: string | null;
  scoredAt: string | null;
  createdAt: string;
}

interface FlagRecommendation {
  id: string;
  flagName: string;
  relaxationType: 'quadrant' | 'stability';
  streakCount: number;
  candidateFixtureIds: string[];
  recommendation: string;
  acknowledged: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'btts_shadow_validation';
const REC_STORAGE_KEY = 'btts_shadow_flag_recommendations';

function loadRecords(): ShadowVerdictRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecords(records: ShadowVerdictRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 500)));
  } catch {
    /* storage full — drop oldest */
  }
}

function loadRecs(): FlagRecommendation[] {
  try {
    const raw = localStorage.getItem(REC_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecs(recs: FlagRecommendation[]) {
  try {
    localStorage.setItem(REC_STORAGE_KEY, JSON.stringify(recs.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

function pct(v: number | null | undefined, digits = 1): string {
  return typeof v === 'number' && Number.isFinite(v) ? `${(v * 100).toFixed(digits)}%` : '—';
}

interface BttsShadowValidationPanelProps {
  candidates: CoreTraceCandidate[];
  roundId: string;
}

export function BttsShadowValidationPanel({ candidates, roundId }: BttsShadowValidationPanelProps) {
  const [records, setRecords] = useState<ShadowVerdictRecord[]>([]);
  const [recs, setRecs] = useState<FlagRecommendation[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
    setRecs(loadRecs());
  }, []);

  const shadowCandidates = useMemo(
    () => candidates.filter((c) => c.shadowVerdict?.wouldPass),
    [candidates]
  );

  const livePassCount = useMemo(
    () => candidates.filter((c) => c.code === 'BTTS' && c.failed.length === 0).length,
    [candidates]
  );

  const liveFailCount = useMemo(
    () => candidates.filter((c) => c.code === 'BTTS' && c.failed.length > 0).length,
    [candidates]
  );

  const shadowWouldPassCount = shadowCandidates.length;

  useEffect(() => {
    if (shadowWouldPassCount === 0) return;

    const existing = loadRecords();
    const existingIds = new Set(existing.map((r) => `${r.roundId}:${r.fixtureId}`));

    const newRecords: ShadowVerdictRecord[] = shadowCandidates.map((c) => {
      const recordId = `${roundId}:${c.fixtureId ?? c.id}`;
      return {
        id: recordId,
        roundId,
        fixtureId: c.fixtureId ?? c.id,
        fixtureLabel: c.fixture,
        modelProb: c.modelProb,
        stability: c.stability,
        marketConfidence: c.stability,
        liveQuadrant: c.quadrant,
        shadowQuadrant: c.shadowVerdict!.shadowQuadrant ?? '—',
        relaxedBy: c.shadowVerdict!.relaxedBy,
        liveGateFailures: c.failed,
        evidenceLevel: c.evidence,
        bandDiagnosis: c.evidenceKind ?? '—',
        actualBtts: null,
        actualOutcome: null,
        scoredAt: null,
        createdAt: new Date().toISOString(),
      };
    }).filter((r) => !existingIds.has(r.id));

    if (newRecords.length > 0) {
      const updated = [...newRecords, ...existing].slice(0, 500);
      setRecords(updated);
      saveRecords(updated);
    }
  }, [shadowCandidates, roundId]);

  const handleScore = useCallback((recordId: string, btts: boolean, outcome: string) => {
    setRecords((prev) => {
      const updated = prev.map((r) =>
        r.id === recordId
          ? { ...r, actualBtts: btts, actualOutcome: outcome, scoredAt: new Date().toISOString() }
          : r
      );
      saveRecords(updated);
      return updated;
    });
  }, []);

  const handleClearRound = useCallback(() => {
    setRecords((prev) => {
      const updated = prev.filter((r) => r.roundId !== roundId);
      saveRecords(updated);
      return updated;
    });
  }, [roundId]);

  const scoredRecords = useMemo(() => records.filter((r) => r.actualBtts !== null), [records]);
  const unscoredRecords = useMemo(() => records.filter((r) => r.actualBtts === null), [records]);

  const stats = useMemo(() => {
    const total = scoredRecords.length;
    const hits = scoredRecords.filter((r) => r.actualBtts === true).length;
    const misses = scoredRecords.filter((r) => r.actualBtts === false).length;
    const byRelaxation = {
      quadrant: { hits: 0, total: 0 },
      stability: { hits: 0, total: 0 },
    };
    for (const r of scoredRecords) {
      if (r.relaxedBy.includes('quadrant')) {
        byRelaxation.quadrant.total++;
        if (r.actualBtts) byRelaxation.quadrant.hits++;
      }
      if (r.relaxedBy.includes('stability')) {
        byRelaxation.stability.total++;
        if (r.actualBtts) byRelaxation.stability.hits++;
      }
    }
    return { total, hits, misses, byRelaxation, hitRate: total > 0 ? hits / total : null };
  }, [scoredRecords]);

  const handleAckRec = useCallback((recId: string) => {
    setRecs((prev) => {
      const updated = prev.map((r) => (r.id === recId ? { ...r, acknowledged: true } : r));
      saveRecs(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    if (stats.total < 3) return;
    const types: ('quadrant' | 'stability')[] = ['quadrant', 'stability'];
    for (const type of types) {
      const typeRecords = scoredRecords
        .filter((r) => r.relaxedBy.includes(type))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      const recentStreak = typeRecords.slice(0, 3);
      if (recentStreak.length >= 3 && recentStreak.every((r) => r.actualBtts === true)) {
        const flagName = type === 'quadrant' ? 'BTTS_QUADRANT_RELAXED_ACTIVE' : 'BTTS_STABILITY_RELAXED_ACTIVE';
        const existing = loadRecs();
        const exists = existing.some(
          (r) => r.flagName === flagName && !r.acknowledged
        );
        if (!exists) {
          const newRec: FlagRecommendation = {
            id: `${flagName}-${Date.now()}`,
            flagName,
            relaxationType: type,
            streakCount: recentStreak.length,
            candidateFixtureIds: recentStreak.map((r) => r.fixtureId),
            recommendation:
              `3 egymást követő BTTS sor, amely a(z) ${type === 'quadrant' ? 'kvadráns' : 'stabilitás'} ` +
              `lazítással bekerült volna a Core-ra, mindkettő bevált. Érdemes megfontolni a ` +
              `${flagName} flag bekapcsolását.`,
            acknowledged: false,
            createdAt: new Date().toISOString(),
          };
          const updated = [newRec, ...existing].slice(0, 50);
          setRecs(updated);
          saveRecs(updated);
        }
      }
    }
  }, [stats.total, scoredRecords]);

  const unackRecs = useMemo(() => recs.filter((r) => !r.acknowledged), [recs]);

  return (
    <Collapsible
      title="BTTS Árnyék-validációs Dashboard"
      subtitle={`${shadowWouldPassCount} árnyék-jelölt ebben a fordulóban · ${stats.total} pontozott összesen · ${unscoredRecords.length} pontozatlan`}
      defaultOpen={shadowWouldPassCount > 0 || unackRecs.length > 0}
    >
      <div className="flex min-w-0 flex-col gap-4 px-3 py-3 sm:px-4">
        <p className="max-w-3xl text-[11px] leading-relaxed text-muted-foreground">
          A BTTS Core-kapu jelenleg élő küszöbökkel működik (pMin=58%, cMin=56, stab=55).
          A lazított küszöbök (pMin=54%, cMin=25, stab=52) árnyék-módban futnak —
          minden sor, amely az élő kapun elbukik de a lazítotttal átmenne, ide kerül.
          A tényleges eredmények pontozásával adatalapú döntés születhet a flag-ek
          bekapcsolásáról.
        </p>

        {/* --- Summary cards --- */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="flex flex-col gap-0.5 rounded-md border border-border bg-background/60 px-3 py-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-label text-muted-foreground">
              Élő kapun átment
            </span>
            <span className="font-mono text-[20px] font-bold tabular-nums text-positive">
              {livePassCount}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md border border-border bg-background/60 px-3 py-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-label text-muted-foreground">
              Árnyék-bekerült
            </span>
            <span className="font-mono text-[20px] font-bold tabular-nums text-chart-4">
              {shadowWouldPassCount}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md border border-border bg-background/60 px-3 py-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-label text-muted-foreground">
              Élő kapun elbukott
            </span>
            <span className="font-mono text-[20px] font-bold tabular-nums text-negative">
              {liveFailCount}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md border border-border bg-background/60 px-3 py-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-label text-muted-foreground">
              Pontozott árnyék
            </span>
            <span className="font-mono text-[20px] font-bold tabular-nums text-foreground">
              {stats.total}
            </span>
            {stats.hitRate !== null && (
              <span className={`font-mono text-[10px] ${stats.hitRate >= 0.5 ? 'text-positive' : 'text-negative'}`}>
                beválás: {pct(stats.hitRate, 0)}
              </span>
            )}
          </div>
        </div>

        {/* --- Flag recommendations --- */}
        {unackRecs.length > 0 && (
          <div className="flex flex-col gap-2">
            {unackRecs.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start gap-3 rounded-md border border-chart-4/30 bg-chart-4/10 px-3 py-2"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" aria-hidden={true} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-[11px] leading-relaxed text-chart-4">
                    <strong className="font-bold">Flag-javaslat:</strong> {rec.recommendation}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {rec.streakCount} sor · {rec.candidateFixtureIds.join(', ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAckRec(rec.id)}
                      className="rounded-sm border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-label text-foreground transition-colors hover:bg-elevated"
                    >
                      Észrevettem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Per-relaxation breakdown --- */}
        {stats.total > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-background/60 px-3 py-2">
              <p className="font-mono text-[9px] font-bold uppercase tracking-label text-muted-foreground">
                Kvadráns-lazítás beválása
              </p>
              <p className="font-mono text-[14px] tabular-nums">
                <span className="text-positive">{stats.byRelaxation.quadrant.hits}</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-foreground">{stats.byRelaxation.quadrant.total}</span>
                {stats.byRelaxation.quadrant.total > 0 && (
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    ({pct(stats.byRelaxation.quadrant.hits / stats.byRelaxation.quadrant.total, 0)})
                  </span>
                )}
              </p>
            </div>
            <div className="rounded-md border border-border bg-background/60 px-3 py-2">
              <p className="font-mono text-[9px] font-bold uppercase tracking-label text-muted-foreground">
                Stabilitás-lazítás beválása
              </p>
              <p className="font-mono text-[14px] tabular-nums">
                <span className="text-positive">{stats.byRelaxation.stability.hits}</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-foreground">{stats.byRelaxation.stability.total}</span>
                {stats.byRelaxation.stability.total > 0 && (
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    ({pct(stats.byRelaxation.stability.hits / stats.byRelaxation.stability.total, 0)})
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* --- This round's shadow candidates --- */}
        <SectionHeading icon={Eye} hint={`${shadowWouldPassCount} sor ebben a fordulóban`}>
          Jelenlegi forduló árnyék-jelöltjei
        </SectionHeading>
        {shadowWouldPassCount === 0 ? (
          <p className="rounded-md border border-border bg-background/40 px-3 py-3 text-[11px] leading-relaxed text-muted-foreground">
            Ebben a fordulóban egyetlen BTTS sor sem került volna be a lazított küszöbökkel.
          </p>
        ) : (
          <TableScroll className="max-h-[280px]">
            <Table minWidth={900}>
              <thead>
                <tr>
                  <Th>Mérkőzés</Th>
                  <Th align="center">Modell</Th>
                  <Th align="center">Stab.</Th>
                  <Th align="center">Élő kvadráns</Th>
                  <Th align="center">Árnyék kvadráns</Th>
                  <Th align="center">Lazítás</Th>
                  <Th align="center">Evidencia</Th>
                </tr>
              </thead>
              <tbody>
                {shadowCandidates.map((c) => (
                  <Tr key={c.id}>
                    <Td className="whitespace-normal font-sans text-foreground">
                      {c.fixture}
                      <span className="block font-mono text-[9px] text-muted-foreground">
                        {c.code} · {c.patternType}
                      </span>
                    </Td>
                    <Td align="center">{pct(c.modelProb)}</Td>
                    <Td align="center">{c.stability.toFixed(0)}</Td>
                    <Td align="center" className="text-negative">{c.quadrant}</Td>
                    <Td align="center" className="text-chart-4">
                      {c.shadowVerdict!.shadowQuadrant ?? '—'}
                    </Td>
                    <Td align="center" className="text-[10px] text-chart-4">
                      {c.shadowVerdict!.relaxedBy.join(', ')}
                    </Td>
                    <Td align="center" className="text-[10px]">
                      {c.evidence}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}

        {/* --- Historical scored records --- */}
        <SectionHeading icon={TrendingUp} hint={`${unscoredRecords.length} pontozatlan · ${stats.total} pontozott`}>
          Történelmi árnyék-jelöltek — eredmények pontozása
        </SectionHeading>
        {records.length === 0 ? (
          <p className="rounded-md border border-border bg-background/40 px-3 py-3 text-[11px] leading-relaxed text-muted-foreground">
            Még nincs rögzített árnyék-jelölt. A shadow verdict-ek automatikusan
            gyűlnek, ahogy a fordulók futnak.
          </p>
        ) : (
          <>
            <TableScroll className="max-h-[400px]">
              <Table minWidth={1100}>
                <thead>
                  <tr>
                    <Th>Mérkőzés</Th>
                    <Th align="center">Forduló</Th>
                    <Th align="center">Modell</Th>
                    <Th align="center">Lazítás</Th>
                    <Th align="center">Élő kapu bukás</Th>
                    <Th align="center">Eredmény</Th>
                    <Th align="center">BTTS?</Th>
                    <Th align="center">Pontozás</Th>
                  </tr>
                </thead>
                <tbody>
                  {unscoredRecords.length === 0 && scoredRecords.length === 0 ? (
                    <EmptyRow colSpan={8}>Nincs rögzített árnyék-jelölt.</EmptyRow>
                  ) : (
                    [
                      ...unscoredRecords.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
                      ...scoredRecords.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
                    ].map((r) => (
                      <Tr key={r.id}>
                        <Td className="whitespace-normal font-sans text-foreground">
                          {r.fixtureLabel}
                        </Td>
                        <Td align="center" className="text-[9px] text-muted-foreground">
                          {r.roundId.slice(0, 20)}
                        </Td>
                        <Td align="center">{pct(r.modelProb)}</Td>
                        <Td align="center" className="text-[10px] text-chart-4">
                          {r.relaxedBy.join(', ')}
                        </Td>
                        <Td align="center" className="text-[10px] text-negative">
                          {r.liveGateFailures.join(', ')}
                        </Td>
                        <Td align="center" className="text-[10px]">
                          {r.actualOutcome ?? '—'}
                        </Td>
                        <Td align="center">
                          {r.actualBtts === null ? (
                            <span className="text-muted-foreground">?</span>
                          ) : r.actualBtts ? (
                            <span className="inline-flex items-center gap-0.5 text-positive">
                              <CheckCircle2 className="h-3 w-3" aria-hidden={true} /> Igen
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-negative">
                              <XCircle className="h-3 w-3" aria-hidden={true} /> Nem
                            </span>
                          )}
                        </Td>
                        <Td align="center">
                          {r.actualBtts === null ? (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => handleScore(r.id, true, 'BTTS')}
                                className="rounded-sm border border-positive/30 bg-positive/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-positive transition-colors hover:bg-positive/20"
                              >
                                BEVÁLT
                              </button>
                              <button
                                type="button"
                                onClick={() => handleScore(r.id, false, 'NO_BTTS')}
                                className="rounded-sm border border-negative/30 bg-negative/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-negative transition-colors hover:bg-negative/20"
                              >
                                NEM
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-[9px] text-muted-foreground">
                              {r.scoredAt ? new Date(r.scoredAt).toLocaleDateString('hu') : '—'}
                            </span>
                          )}
                        </Td>
                      </Tr>
                    ))
                  )}
                </tbody>
              </Table>
            </TableScroll>
            <div className="flex items-center justify-between">
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {unscoredRecords.length} pontozatlan sor vár eredményre.
                {stats.total > 0 && ` Beválási arány: ${pct(stats.hitRate, 0)} (${stats.hits}/${stats.total}).`}
              </p>
              <button
                type="button"
                onClick={handleClearRound}
                className="rounded-sm border border-border bg-background/60 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-label text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
              >
                Forduló törlése
              </button>
            </div>
          </>
        )}
      </div>
    </Collapsible>
  );
}
