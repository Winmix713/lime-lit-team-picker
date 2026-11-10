import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ImportPairsBox } from './ImportPairsBox';
import type { FixtureRound } from '../../types/winmix';

afterEach(cleanup);

it('rejects non-image input before upload', () => {
  render(<ImportPairsBox league="angol" pool={[]} round={{} as FixtureRound} setFixtureTeam={vi.fn()} />);
  const input = screen.getByLabelText(/párosítások képének kiválasztása/);
  fireEvent.change(input, { target: { files: [new File(['text'], 'pairs.txt', { type: 'text/plain' })] } });
  expect(screen.getByRole('button', { name: /kép feltöltése/ })).toBeDisabled();
});