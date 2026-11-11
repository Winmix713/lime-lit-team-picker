import React, { useMemo, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { useWinmix } from '../../contexts/WinmixContext';
import {
  applyCalibration,
  bttsObservations,
  fitCalibrationMap,
  topPickOf } from
'../../utils/calibrationLab';
import { cn } from '../../lib/utils';
import { ConfidenceBadge, RecommendationLabel, SufficiencyBadge } from './Badges';
import { EmptyRow, Table, TableScroll, Td, Th, Tr } from './DataTable';
import { MatchInspectorModal } from './MatchInspectorModal';
import { Chip, Panel, PanelHeader, PanelTitle } from './Panel';
import type { MatchRow, Probs } from '../../types/winmix';

const PAGE = 100;
type Scope = 'season' | 'all';
type HitFilter = 'all' | 'hit' | 'miss' | 'btts_hit' | 'btts_miss';

function triple(p: Probs) {
  return `${(p.home * 100).toFixed(0)} / ${(p.draw * 100).toFixed(0)} / ${(p.away * 100).toFixed(0)}%`;
}

function HitMark({ ok }: {ok: boolean;}) {
  return ok ?
  <Check className="mx-auto h-4 w-4 text-positive" aria-label="Talált" /> :
  <X className="mx-auto h-4 w-4 text-negative" aria-label="Nem talált" />;
}

export function MatchLogPanel() {
  const { selectedSeason, leagueMatches } = useWinmix();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('season');
  const [filter, setFilter] = useState<HitFilter>('all');
  const [limit, setLimit] = useState(PAGE);
  const [inspected, setInspected] = useState<MatchRow | null>(null);

  // A BTTS korrekciót a liga teljes állományából illesztjük.
  const bttsMap = useMemo(() => fitCalibrationMap(bttsObservations(leagueMatches)), [leagueMatches]);

  const base = scope === 'all' ? leagueMatches : selectedSeason?.matches ?? [];

  const rows = useMemo(() => {
    const search = query.toLowerCase().trim();
    return base.filter((m) => {
      const p = m.pipeline;
      if (!p) return false;
      if (search && !m.home_team.toLowerCase().includes(search) && !m.away_team.toLowerCase().includes(search)) return false;
      if (filter === 'all') return true;
      if (filter === 'hit' || filter === 'miss') {
        const ok = topPickOf(p.calibrated).outcome === m.outcome;
        return filter === 'hit' ? ok : !ok;
      }
      const b = p.secondary?.btts;
      if (typeof b !== 'number') return false;
      const ok = b >= 0.5 === m.btts;
      return filter === 'btts_hit' ? ok : !ok;
    });
  }, [base, query, filter]);

  const summary = useMemo(() => {
    let h = 0, bt = 0, bn = 0;
    rows.forEach((m) => {
      const p = m.pipeline!;
      if (topPickOf(p.calibrated).outcome === m.outcome) h += 1;
      if (typeof p.secondary?.btts === 'number') {
        bn += 1;
        if (p.secondary.btts >= 0.5 === m.btts) bt += 1;
      }
    });
    return { n: rows.length, oneX2: rows.length ? h / rows.length * 100 : 0, btts: bn ? bt / bn * 100 : 0 };
  }, [rows]);

  const visible = rows.slice(0, limit);

  return (
    <Panel>
      <PanelHeader>
        <div className="flex flex-wrap items-center gap-3">
          <PanelTitle>Szezon mérkőzésnapló &amp; WinMix Pipeline v2 javaslatok</PanelTitle>
          <div role="group" aria-label="Hatókör" className="seg">
            {([['season', 'Kiválasztott szezon'], ['all', 'Összes szezon']] as const).map(([k, l]) =>
            <button key={k} type="button" aria-pressed={scope === k}
            onClick={() => {setScope(k);setLimit(PAGE);}}
            className={cn('seg-tab', scope === k && 'is-active')}>{l}</button>
            )}
          </div>
          <select
            aria-label="Találati szűrő"
            value={filter}
            onChange={(e) => {setFilter(e.target.value as HitFilter);setLimit(PAGE);}}
            className="field h-8 text-[12px]">
            <option value="all">Minden mérkőzés</option>
            <option value="hit">1X2 talált</option>
            <option value="miss">1X2 tévedett</option>
            <option value="btts_hit">BTTS talált</option>
            <option value="btts_miss">BTTS tévedett</option>
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => {setQuery(e.target.value);setLimit(PAGE);}}
            placeholder="Keresés csapatnévre…" aria-label="Keresés csapatnévre a mérkőzésnaplóban"
            className="field h-8 w-[210px] pl-8 text-[12px]" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip>{summary.n} meccs</Chip>
          <Chip>1X2 találat {summary.oneX2.toFixed(1)}%</Chip>
          <Chip>BTTS találat {summary.btts.toFixed(1)}%</Chip>
        </div>
      </PanelHeader>

      <TableScroll>
        <Table minWidth={1440}>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Időpont</Th>
              <Th align="right">Hazai csapat</Th>
              <Th align="center">FT</Th>
              <Th>Vendég csapat</Th>
              <Th align="center">Data Suff.</Th>
              <Th align="center">B1 Poisson</Th>
              <Th align="center">M1 LogReg</Th>
              <Th align="center" className="text-signal">WinMix Ens. (Calib)</Th>
              <Th align="center">1X2</Th>
              <Th align="center">BTTS nyers → kalibrált</Th>
              <Th align="center">Valós BTTS</Th>
              <Th align="center">BTTS</Th>
              <Th align="center">Confidence</Th>
              <Th align="center">Javaslat</Th>
              <Th align="center">Audit</Th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {visible.length === 0 ?
            <EmptyRow colSpan={16}>
                {base.length ? 'Nincs a szűrésnek megfelelő mérkőzés.' : 'Nincs betöltött mérkőzés.'}
              </EmptyRow> :
            visible.map((m, i) => {
              const p = m.pipeline!;
              const oneX2Ok = topPickOf(p.calibrated).outcome === m.outcome;
              const b = p.secondary?.btts;
              const hasB = typeof b === 'number';
              const bCal = hasB ? applyCalibration(b, bttsMap) : 0;
              return (
                <Tr key={`${m.sourceFileId ?? ''}-${m.match_no}-${m.home_team}-${i}`}>
                    <Td className="text-muted-foreground">{m.match_no}</Td>
                    <Td className="text-muted-foreground">{m.date}</Td>
                    <Td align="right" className="font-sans font-bold text-foreground">{m.home_team}</Td>
                    <Td align="center" className="font-extrabold">
                      <span className="rounded-sm bg-elevated px-2 py-1">{m.home_score} - {m.away_score}</span>
                    </Td>
                    <Td className="font-sans font-bold text-foreground">{m.away_team}</Td>
                    <Td align="center"><SufficiencyBadge level={p.context.dataSufficiency} /></Td>
                    <Td align="center" className="text-muted-foreground">{triple(p.b1)}</Td>
                    <Td align="center" className="text-chart-3">{triple(p.m1)}</Td>
                    <Td align="center" className="font-extrabold text-signal">{triple(p.calibrated)}</Td>
                    <Td align="center"><HitMark ok={oneX2Ok} /></Td>
                    <Td align="center">
                      {hasB ? <><span className="text-muted-foreground">{(b * 100).toFixed(0)}%</span> → <span className="font-bold text-foreground">{(bCal * 100).toFixed(0)}%</span></> : '—'}
                    </Td>
                    <Td align="center" className={m.btts ? 'font-bold text-positive' : 'text-muted-foreground'}>
                      {m.btts ? 'IGEN' : 'NEM'}
                    </Td>
                    <Td align="center">{hasB ? <HitMark ok={b >= 0.5 === m.btts} /> : '—'}</Td>
                    <Td align="center"><ConfidenceBadge score={p.confidence} label={p.confidenceLabel} /></Td>
                    <Td align="center"><RecommendationLabel value={p.recommendation} /></Td>
                    <Td align="center">
                      <button type="button" className="btn btn--outline btn--sm text-[10px]" onClick={() => setInspected(m)}>Audit</button>
                    </Td>
                  </Tr>);
            })}
          </tbody>
        </Table>
      </TableScroll>

      {rows.length > limit ?
      <div className="flex justify-center p-3">
          <button type="button" className="btn btn--outline btn--sm" onClick={() => setLimit((l) => l + PAGE * 5)}>
            Továbbiak betöltése ({rows.length - limit} maradt)
          </button>
        </div> :
      null}

      {inspected ? <MatchInspectorModal match={inspected} onClose={() => setInspected(null)} /> : null}
    </Panel>);
}
