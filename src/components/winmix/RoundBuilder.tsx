import React from 'react';
import { Eraser } from 'lucide-react';
import { LEAGUE_FLAG, LEAGUE_LABEL } from '../../data/leagues';
import { cn } from '../../lib/utils';
import { isComplete } from '../../utils/fixtures';
import type { TeamOption } from '../../utils/fixtures';
import type { Fixture, League } from '../../types/winmix';
import { Chip } from './Panel';
import { TeamSelect } from './TeamSelect';

interface RoundBuilderProps {
  league: League;
  fixtures: Fixture[];
  pool: TeamOption[];
  used: Set<string>;
  patternCounts: Record<string, number>;
  onSelect: (fixtureId: string, side: 'home' | 'away', key: string | null) => void;
  onClear: (fixtureId: string) => void;
}

export function RoundBuilder({
  league,
  fixtures,
  pool,
  used,
  patternCounts,
  onSelect,
  onClear
}: RoundBuilderProps) {
  const filled = fixtures.filter(isComplete).length;
  const empty = pool.length === 0;

  return (
    <section className="predictor-builder group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-panel transition-colors hover:border-border-strong">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-surface-2/80 px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <p className="section-label text-muted-foreground">Csapatpárok</p>
          <h3 className="mt-1 flex items-center gap-2 text-ui-base font-semibold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-sm" aria-hidden={true}>{LEAGUE_FLAG[league]}</span>
            {LEAGUE_LABEL[league]}
          </h3>
        </div>
        <Chip tone={filled === fixtures.length ? 'signal' : 'neutral'} className="rounded-full px-2.5">
          {filled} / {fixtures.length} kész
        </Chip>
      </div>

      {empty ?
      <p className="px-4 py-8 text-center text-ui-sm leading-relaxed text-muted-foreground">
          Nincs betöltött {LEAGUE_LABEL[league].toLowerCase()} szezon — töltsd fel a CSV-t a Taktikai
          Stúdióban, hogy a csapatlista feltöltődjön.
        </p> :

      <ul className="flex flex-col divide-y divide-border">
          {fixtures.map((fixture) => {
          const complete = isComplete(fixture);
          const count = patternCounts[fixture.id] ?? 0;
          return (
            <li
              key={fixture.id}
              className={cn(
                'predictor-fixture-row flex items-center gap-2 border-l-2 px-3 py-2.5 transition-colors sm:px-4',
                complete ? 'border-l-signal bg-signal/[0.035]' : 'border-l-transparent hover:bg-surface-1'
              )}>
              
                <span className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold',
                  complete ? 'bg-signal-soft text-signal' : 'bg-background text-muted-foreground'
                )}>
                  {fixture.slot}
                </span>

                {/* Stacked on a phone: two 40px selects side by side leave no
                   room for either team name. */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                  <TeamSelect
                  value={fixture.homeKey}
                  options={pool}
                  excluded={used}
                  placeholder="Hazai"
                  onChange={(key) => onSelect(fixture.id, 'home', key)} />
                
                  <span
                  className="hidden shrink-0 rounded-full border border-border-subtle px-1.5 py-0.5 font-mono text-[9px] uppercase text-muted-foreground sm:inline"
                  aria-hidden={true}>
                    vs
                  </span>
                  <TeamSelect
                  value={fixture.awayKey}
                  options={pool}
                  excluded={used}
                  placeholder="Vendég"
                  onChange={(key) => onSelect(fixture.id, 'away', key)} />
                
                </div>

                <span className="w-10 shrink-0 text-right font-mono text-[10px] text-signal">
                  {count > 0 ? `${count} minta` : <span className="text-muted-foreground">—</span>}
                </span>
                <button
                type="button"
                aria-label={`${fixture.slot}. sor kiürítése`}
                disabled={!fixture.homeKey && !fixture.awayKey}
                onClick={() => onClear(fixture.id)}
                className="tap flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-negative-soft hover:text-negative disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground">
                
                  <Eraser className="h-3.5 w-3.5" aria-hidden={true} />
                </button>
              </li>);

        })}
        </ul>
      }
    </section>);

}