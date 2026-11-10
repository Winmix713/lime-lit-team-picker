import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ImportPairsBox } from './ImportPairsBox';
import type { FixtureRound } from '../../types/winmix';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('rejects non-image input before upload', () => {
  render(<ImportPairsBox league="angol" pool={[]} round={{} as FixtureRound} setFixtureTeam={vi.fn()} />);
  const input = screen.getByLabelText(/párosítások képének kiválasztása/);
  fireEvent.change(input, { target: { files: [new File(['text'], 'pairs.txt', { type: 'text/plain' })] } });
  expect(screen.getByRole('button', { name: /kép feltöltése/ })).toBeDisabled();
});

it.each(['angol', 'spanyol'] as const)('immediately displays a clipboard image for %s without a separate upload', async league => {
  const read = vi.fn().mockResolvedValue([{ types: ['image/png'], getType: async () => new Blob(['image'], { type: 'image/png' }) }]);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { read } });
  const create = vi.fn().mockReturnValue('blob:clipboard-image');
  vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: vi.fn() });
  vi.stubGlobal('Image', class { src = ''; naturalWidth = 420; naturalHeight = 120; decode() { return Promise.resolve(); } });
  render(<ImportPairsBox league={league} pool={[]} round={{} as FixtureRound} setFixtureTeam={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /kép beillesztése/ }));
  await waitFor(() => expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:clipboard-image'));
  expect(screen.getByRole('img')).toHaveAttribute('width', '210');
  expect(screen.getByRole('img')).toHaveAttribute('height', '60');
  expect(read).toHaveBeenCalledTimes(1);
  expect(create.mock.calls[0]?.[0].type).toBe('image/png');
  expect(screen.getByRole('button', { name: /kép feltöltése/ })).toBeDisabled();
});

it('does not upload anything when the clipboard only contains text', async () => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { read: vi.fn().mockResolvedValue([{ types: ['text/plain'] }]) } });
  render(<ImportPairsBox league="angol" pool={[]} round={{} as FixtureRound} setFixtureTeam={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /kép beillesztése/ }));
  await screen.findByRole('alert');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});