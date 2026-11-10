import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, Check, ClipboardPaste, ImagePlus, LoaderCircle, Replace, Upload, X } from 'lucide-react';
import { LEAGUE_LABEL } from '../../data/leagues';
import type { League, FixtureRound } from '../../types/winmix';
import type { TeamOption } from '../../utils/fixtures';

interface ImportPairsBoxProps {
  league: League;
  pool: TeamOption[];
  round: FixtureRound;
  setFixtureTeam: (fixtureId: string, side: 'home' | 'away', key: string | null) => void;
}

export function ImportPairsBox({ league }: ImportPairsBoxProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef(0);
  const previewRef = useRef<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pasting, setPasting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const leagueName = LEAGUE_LABEL[league];

  useEffect(() => () => {
    requestRef.current += 1;
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  const choose = (candidate: File | undefined) => {
    if (!candidate) return;
    requestRef.current += 1;
    setLoading(false);
    setError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(candidate.type)) {
      setError('PNG, JPG vagy WebP képet válassz.');
      setFile(null);
      return;
    }
    setFile(candidate);
  };

  const upload = async (candidate: File, request = ++requestRef.current) => {
    const url = URL.createObjectURL(candidate);
    setLoading(true);
    setError('');
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (request !== requestRef.current) {
        URL.revokeObjectURL(url);
        return;
      }
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = url;
      setPreview({ url, name: candidate.name });
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch {
      URL.revokeObjectURL(url);
      if (request === requestRef.current) setError('A kép nem nyitható meg. Válassz másik fájlt.');
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  };

  const paste = async () => {
    if (pasting || loading) return;
    const request = ++requestRef.current;
    setPasting(true);
    setError('');
    try {
      if (!navigator.clipboard?.read) {
        setError('Ez a böngésző nem támogatja a kép beillesztését. Válaszd a Kép kiválasztása gombot.');
        return;
      }
      const items = await navigator.clipboard.read();
      if (request !== requestRef.current) return;
      for (const item of items) {
        const type = item.types.find(type => ['image/png', 'image/jpeg', 'image/webp'].includes(type));
        if (!type) continue;
        const blob = await item.getType(type);
        if (request !== requestRef.current) return;
        const extension = type === 'image/jpeg' ? 'jpg' : type.split('/')[1];
        await upload(new File([blob], `${leagueName}-beillesztett-kep.${extension}`, { type }), request);
        return;
      }
      setError('A vágólapon nincs kép. Másold ki a kívánt képet, majd próbáld újra.');
    } catch {
      if (request === requestRef.current) setError('A vágólap nem érhető el. Engedélyezd a hozzáférést a böngészőben, vagy válassz képfájlt.');
    } finally {
      setPasting(false);
    }
  };

  const remove = () => {
    requestRef.current += 1;
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setPreview(null);
    setFile(null);
    setError('');
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <section aria-label={`Párosítások beillesztése — ${leagueName}`} className="min-w-0 border-b border-border-subtle px-4 py-4 sm:px-5">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-2 text-ui-sm font-semibold text-foreground">
          <ImagePlus className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>Párosítások beillesztése — {leagueName}</span>
        </h3>
        {preview && <span className="flex shrink-0 items-center gap-1 text-ui-2xs text-positive"><Check className="h-3 w-3" aria-hidden="true" />Feltöltve</span>}
      </div>

      <input id={inputId} ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" aria-label={`${leagueName} párosítások képének kiválasztása`} onChange={e => choose(e.target.files?.[0])} />

      {preview && (
        <figure className="m-0 mb-3 overflow-hidden rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-3 py-2">
            <figcaption className="min-w-0 truncate text-ui-xs text-muted-foreground" title={preview.name}>{preview.name}</figcaption>
            <button type="button" className="btn btn--ghost btn--sm h-8 w-8 shrink-0 p-0" aria-label={`${leagueName} kép eltávolítása`} title="Kép eltávolítása" onClick={remove}><X className="h-4 w-4" aria-hidden="true" /></button>
          </div>
          <img src={preview.url} alt={`${leagueName} párosítások — feltöltött kép`} className="block max-h-[480px] w-full object-contain" />
        </figure>
      )}

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false); }}
        onDrop={e => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files[0]); }}
        className={`flex min-w-0 flex-col gap-3 rounded-lg border border-dashed p-4 transition-colors sm:flex-row sm:items-center ${dragging ? 'border-signal bg-signal-soft' : 'border-border-strong bg-background'}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <ImagePlus className="h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-ui-xs font-medium text-foreground" title={file?.name}>{file ? file.name : preview ? 'Másik kép kiválasztása' : 'Párosítások képe'}</p>
            <p className="mt-1 text-ui-2xs text-muted-foreground">{file ? `${(file.size / 1024).toFixed(0)} KB · Kiválasztva` : 'PNG, JPG, WebP'}</p>
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button type="button" className="btn btn--ghost btn--sm min-h-11 min-w-0 gap-2 whitespace-normal border border-border" disabled={pasting || loading} onClick={() => inputRef.current?.click()}>
          {preview ? <Replace className="h-4 w-4" aria-hidden="true" /> : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
          Kép kiválasztása
        </button>
        <button type="button" className="btn btn--ghost btn--sm min-h-11 min-w-0 gap-2 border border-border" disabled={pasting || loading} onClick={paste} aria-label={`${leagueName} kép beillesztése`}>
          {pasting ? <LoaderCircle className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" /> : <ClipboardPaste className="h-4 w-4 shrink-0" aria-hidden="true" />}
          {pasting ? 'Beillesztés…' : 'Beillesztés'}
        </button>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button type="button" className="btn btn--signal btn--sm min-h-11 gap-2" disabled={!file || loading || pasting} onClick={() => { if (file) void upload(file); }} aria-label={`${leagueName} kép feltöltése`}>
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
          {loading ? 'Feltöltés…' : 'Feltöltés'}
        </button>
      </div>
      {error && <p role="alert" className="mt-3 flex items-start gap-2 text-ui-xs text-negative"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />{error}</p>}
    </section>
  );
}