import React, { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { TeamSelect, calculatePopoverGeometry, filterTeams, getMonogram } from './TeamSelect';

const teams = [
  { key: 'city', display: 'Manchester City', played: 38 },
  { key: 'united', display: 'Manchester United', played: 37 },
  { key: 'fradi', display: 'Ferencváros', played: 32 },
];

afterEach(cleanup);

function Picker() {
  const [value, setValue] = useState<string | null>(null);
  return <TeamSelect options={teams} excluded={new Set(['united'])} value={value} onChange={setValue} placeholder="Hazai" />;
}

describe('shared team picker', () => {
  it('retains the selected team while excluding teams used elsewhere', () => {
    expect(filterTeams(teams, { value: 'city', query: '', excluded: new Set(['city', 'united']) }).map(t => t.key)).toEqual(['city', 'fradi']);
  });

  it('matches Hungarian team names without requiring accents', () => {
    expect(filterTeams(teams, { value: null, query: 'FERENCVAROS', excluded: new Set() }).map(t => t.key)).toEqual(['fradi']);
  });

  it('keeps desktop geometry inside the available viewport', () => {
    const geometry = calculatePopoverGeometry({ top: 130, bottom: 174, left: 310, width: 180 }, { width: 360, height: 200 });
    expect(geometry).toEqual({ left: 84, width: 264, maxHeight: 110, bottom: 78, top: undefined });
  });

  it('produces a three-letter monogram from the supplied names', () => {
    expect(getMonogram('Aston Villa')).toBe('AST');
    expect(getMonogram('')).toBe('•');
  });

  it('searches, selects and clears the controlled value', () => {
    render(<Picker />);
    fireEvent.click(screen.getByRole('button', { name: 'Hazai' }));
    const input = screen.getByRole('combobox', { name: 'Csapat keresése' });
    fireEvent.change(input, { target: { value: 'ferencvaros' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByRole('button', { name: 'Hazai: Ferencváros' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ferencváros eltávolítása' }));
    expect(screen.getByRole('button', { name: 'Hazai' })).toBeInTheDocument();
  });

  it('does not change selection when Escape dismisses the list', () => {
    const onChange = vi.fn();
    render(<TeamSelect options={teams} excluded={new Set()} value="city" onChange={onChange} placeholder="Hazai" />);
    const trigger = screen.getByRole('button', { name: 'Hazai: Manchester City' });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus();
  });
});