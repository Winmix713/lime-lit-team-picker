import React, { useSyncExternalStore } from 'react';
import { getLatestLoadTiming, subscribeLoadTiming, type LoadPhase } from '../../utils/loadTiming';
import { AlertTriangle, CloudOff } from 'lucide-react';
import { useCloudTierContext } from '../../contexts/CloudTierContext';
import { useWinmix } from '../../contexts/WinmixContext';
import { useWinmixProgress } from '../../hooks/progressStore';

/** Global import/recompute progress plus the storage-backend banner. */
export function StatusBar() {
  const { storageBackend } = useWinmix();
  const progress = useWinmixProgress();
  const cloud = useCloudTierContext();
  const timing = useSyncExternalStore(subscribeLoadTiming, getLatestLoadTiming, () => null);
  const labels: Partial<Record<LoadPhase, string>> = {
    version: 'Verzió', download: 'Letöltés', dataCheck: 'Adatellenőrzés', handoff: 'Átadás',
    workerCalculation: 'Worker számítás Σ', workerRoundTrip: 'Worker válasz Σ', inlineCalculation: 'Helyi számítás',
    cacheRead: 'Gyorsítótár olvasás',
  };

  return (
    <div className="shrink-0">
      {timing && <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 py-2 text-ui-xs text-muted-foreground md:px-6" role="status" aria-label="Betöltési idők">
        <span>Betöltés: {(timing.totalMs / 1000).toFixed(2)} s</span>
        <span>Gyorsítótár: {timing.resultCacheHit ? 'találat' : 'kihagyva'}</span>
        {timing.rows.filter(row => labels[row.phase]).map(row => <span key={row.phase}>{labels[row.phase]}: {row.ms.toFixed(1)} ms</span>)}
      </div>}
      {progress ?
      <div className="flex flex-col gap-1 px-4 py-2 md:px-6" role="status" aria-live="polite">
          <span className="text-ui-xs text-muted-foreground">{progress.label}</span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated-2">
            <div
            className="h-full bg-signal transition-[width] duration-fast ease-linear"
            style={{ width: `${Math.max(0, Math.min(100, progress.pct))}%` }} />
          
          </div>
        </div> :
      null}

      {storageBackend === 'memory' ?
      <div
        role="status"
        className="mx-4 mb-2 flex items-center gap-2 rounded-xl border border-negative/30 bg-negative-soft px-3.5 py-2.5 text-ui-xs text-negative md:mx-6">
        
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Nincs elérhető tartós tárolás — az adatok csak a munkamenet végéig maradnak meg,
          frissítés vagy bezárás után elvesznek.
        </div> :
      null}

      {cloud.health.degraded ?
      <div
        role="status"
        className="mx-4 mb-2 flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-ui-xs text-muted-foreground md:mx-6">
        
          <CloudOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          A felhő adatbázis nem elérhető — a munkamenet helyi tárolóra váltott. Minden funkció működik,
          a keresztellenőrzés a kapcsolat visszaállításakor folytatódik.
        </div> :
      null}
    </div>);

}