import React, { useMemo, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { useWinmix } from '../../contexts/WinmixContext';
import { BAND_MIN_SAMPLE } from '../../utils/constants';
import {
  bttsObservations,
  buildCalibrationReport,
  oneXTwoObservations,
  type CalibrationMarket } from
'../../utils/calibrationLab';
import { cn } from '../../lib/utils';
import { BandRowsTable } from './BandRowsTable';
import { Panel, PanelHeader, PanelSubtitle, PanelTitle } from './Panel';
import type { ReliabilityBand } from '../../types/winmix';

/**
 * Empirikus kalibrációs sáv-tábla — 1X2 (konfidencia-sávok) és BTTS
 * (valószínűségi sávok), a liga teljes kiértékelt mérkőzésállományán.
 * A korrekciót időrendi 70/30 felosztással, független szeleten méri vissza.
 */
export function ReliabilityBandTable({
  bands,
  subtitle,
  className
}: {bands: ReliabilityBand[];subtitle?: React.ReactNode;className?: string;}) {
  const { leagueMatches, recomputeAll, isComputing } = useWinmix();
  const [market, setMarket] = useState<CalibrationMarket | 'conf'>('conf');

  const report = useMemo(() => {
    if (market === 'conf') return null;
    const obs = market === 'btts' ? bttsObservations(leagueMatches) : oneXTwoObservations(leagueMatches);
    return buildCalibrationReport(market, obs);
  }, [leagueMatches, market]);

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <Panel className={className}>
      <PanelHeader>
        <div>
          <PanelTitle>Empirikus kalibrációs sáv-tábla (1X2 + BTTS)</PanelTitle>
          <PanelSubtitle>
            {subtitle ??
            `A liga összes kiértékelt mérkőzésén: mennyit jelzett a modell, és mennyi lett belőle valóban. Minimális értékelhető minta: ${BAND_MIN_SAMPLE} eset.`}
          </PanelSubtitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Kalibrációs piac" className="seg">
            {([
            ['conf', '1X2 · konfidencia'],
            ['1x2', '1X2 · valószínűség'],
            ['btts', 'BTTS']] as
            const).map(([key, label]) =>
            <button
              key={key}
              type="button"
              aria-pressed={market === key}
              onClick={() => setMarket(key)}
              className={cn('seg-tab', market === key && 'is-active')}>
                {label}
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            disabled={isComputing}
            onClick={() => void recomputeAll('Az összes mérkőzés újraelemezve és bekalibrálva.')}>
            {isComputing ?
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> :
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
            Összes mérkőzés kalibrálása
          </button>
        </div>
      </PanelHeader>

      {report ?
      <div className="grid gap-2 px-4 pb-3 text-ui-xs sm:grid-cols-4 md:px-5">
          <Stat label="Kiértékelt mérkőzés" value={`${report.total}`} />
          <Stat label="Tanuló / teszt szelet" value={`${report.trainN} / ${report.testN}`} />
          <Stat
          label="Brier (teszt): nyers → kalibrált"
          value={
          report.brierRaw === null ?
          '—' :
          `${report.brierRaw.toFixed(4)} → ${(report.brierCalibrated ?? 0).toFixed(4)}`
          } />
          <Stat
          label="Korrekció hatása"
          tone={
          report.improvementPct === null ? undefined : report.improvementPct > 0 ? 'pos' : 'neg'
          }
          value={
          report.improvementPct === null ?
          '—' :
          `${report.improvementPct >= 0 ? '+' : ''}${report.improvementPct.toFixed(2)}%`
          } />
        </div> :
      null}

      <BandRowsTable
        rows={report ? report.bands : bands}
        firstColumnLabel={report ? 'Valószínűségi sáv' : 'Konfidencia sáv'}
        empty="Nincs kiértékelt mérkőzés — nyomd meg az „Összes mérkőzés kalibrálása” gombot." />

      {report && report.total > 0 ?
      <p className="px-4 pb-4 pt-2 text-ui-xs text-muted-foreground md:px-5">
          Sávonkénti korrekció (mintamérettel zsugorítva):{' '}
          {report.bands.
        filter((b) => b.n > 0).
        map((b) => `${b.label}: ${b.offset >= 0 ? '+' : ''}${(b.offset * 100).toFixed(1)} pp`).
        join(' · ')}
          . A mérkőzésnapló „kalibrált” oszlopai ezt alkalmazzák; a motor eredeti számai változatlanok.{' '}
          {report.bands.some((b) => b.evaluable && b.diagnosis === 'overconfident') ?
        `Túlmagabiztos sáv: ${report.bands.
        filter((b) => b.evaluable && b.diagnosis === 'overconfident').
        map((b) => `${b.label} (jelzett ${pct(b.avgP)}, valós ${pct(b.hitRate)})`).
        join(', ')}.` :
        ''}
        </p> :
      null}
    </Panel>);
}

function Stat({ label, value, tone }: {label: string;value: string;tone?: 'pos' | 'neg';}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-2 px-3 py-2">
      <p className="text-muted-foreground">{label}</p>
      <p
        className={cn(
          'font-mono text-ui-sm font-semibold tabular-nums text-foreground',
          tone === 'pos' && 'text-positive',
          tone === 'neg' && 'text-negative'
        )}>
        {value}
      </p>
    </div>);
}
