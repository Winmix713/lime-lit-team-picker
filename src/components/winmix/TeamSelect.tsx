import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { TeamOption } from '../../utils/fixtures';


/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export interface TeamSelectCopy {
  searchPlaceholder: string;
  searchLabel: string;
  listLabel: string;
  sheetLabel: string;
  empty: string;
  close: string;
  countSuffix: string;
  refineHint: string;
  removeLabel: (display: string) => string;
}

export interface TeamSelectProps {
  /** Authoritative selected team key (the parent owns this state). */
  value: string | null;
  options: TeamOption[];
  /**
   * Keys already used elsewhere in this league column.
   * Callers should pass a stable Set (e.g. from useMemo) and always replace it
   * immutably — mutating an existing Set will not trigger a re-render.
   */
  excluded: Set<string>;
  placeholder: string;
  disabled?: boolean;
  onChange: (key: string | null) => void;
  /** Optional id for the trigger (combobox) element. */
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Optional UI copy overrides (defaults are Hungarian). */
  copy?: Partial<TeamSelectCopy>;
  /** When set, a hidden input is rendered so the control posts with native forms. */
  name?: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants & copy                                                          */
/* -------------------------------------------------------------------------- */

const TEAM_SELECT_COPY: TeamSelectCopy = {
  searchPlaceholder: 'Csapat keresése…',
  searchLabel: 'Csapat keresése',
  listLabel: 'Csapatok',
  sheetLabel: 'Csapat kiválasztása',
  empty: 'Nincs választható csapat.',
  close: 'Bezárás',
  countSuffix: 'csapat',
  refineHint: 'Pontosítsd a keresést',
  removeLabel: (display) => `${display} eltávolítása`
};

const MIN_LIST_SPACE = 220;
const DESKTOP_MIN_WIDTH = 264;
const VIEWPORT_GUTTER = 12;
const POPOVER_OFFSET = 8; // a CSS-ben margin-top: 0.5rem
const MAX_LIST_HEIGHT = 340;
const COMPACT_QUERY = '(max-width: 639px)';
const PAGE_STEP = 8;
const ANNOUNCE_DELAY_MS = 300;
const MAX_RENDERED_OPTIONS = 100;
const KEYBOARD_INSET_THRESHOLD = 80;
const SHEET_HEIGHT_DVH = 80;
const SHEET_TOP_GAP = 16;
const SHEET_MIN_HEIGHT = 220;
const SWIPE_CLOSE_PX = 80;
const LAYER_ATTR = 'data-team-select-layer';

const IS_DEV = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);

/* -------------------------------------------------------------------------- */
/*  Pure helpers                                                              */
/* -------------------------------------------------------------------------- */

interface PopoverGeometry {
  left: number;
  top?: number;
  bottom?: number;
  width: number;
  maxHeight: number;
}

interface RectLike {
  top: number;
  bottom: number;
  left: number;
  width: number;
}

/**
 * Collision-safe geometry: the list may be smaller than the preferred height,
 * but it never exceeds the space that genuinely exists in the chosen direction.
 */
export function calculatePopoverGeometry(
  rect: RectLike,
  viewport: { width: number; height: number }
): PopoverGeometry {
  const spaceBelow = viewport.height - rect.bottom - VIEWPORT_GUTTER - POPOVER_OFFSET;
  const spaceAbove = rect.top - VIEWPORT_GUTTER - POPOVER_OFFSET;
  const flipUp = spaceBelow < MIN_LIST_SPACE && spaceAbove > spaceBelow;
  const available = Math.max(0, flipUp ? spaceAbove : spaceBelow);
  const width = Math.max(
    0,
    Math.min(Math.max(rect.width, DESKTOP_MIN_WIDTH), viewport.width - VIEWPORT_GUTTER * 2)
  );
  const left = Math.max(
    VIEWPORT_GUTTER,
    Math.min(rect.left, viewport.width - width - VIEWPORT_GUTTER)
  );
  return {
    left,
    width,
    maxHeight: Math.min(MAX_LIST_HEIGHT, available),
    top: flipUp ? undefined : rect.bottom + POPOVER_OFFSET,
    bottom: flipUp ? viewport.height - rect.top + POPOVER_OFFSET : undefined
  };
}

function isRectOutOfView(rect: RectLike, viewportHeight: number): boolean {
  return rect.bottom < 0 || rect.top > viewportHeight;
}

function sameGeometry(a: PopoverGeometry, b: PopoverGeometry): boolean {
  return (
    a.left === b.left &&
    a.top === b.top &&
    a.bottom === b.bottom &&
    a.width === b.width &&
    a.maxHeight === b.maxHeight
  );
}

function readTriggerGeometry(el: HTMLElement | null): PopoverGeometry | null {
  if (!el || typeof window === 'undefined') return null;
  return calculatePopoverGeometry(el.getBoundingClientRect(), {
    width: window.innerWidth,
    height: window.innerHeight
  });
}

/** Lower-case, accent-insensitive form used only for matching. */
function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('hu').trim();
}

/**
 * Visible teams: the selected team is always kept (even if excluded elsewhere),
 * excluded teams are hidden, and the query is matched accent-insensitively.
 * Input order is preserved.
 */
export function filterTeams(
  options: TeamOption[],
  { query, value, excluded }: { query: string; value: string | null; excluded: Set<string> }
): TeamOption[] {
  const q = normalizeText(query);
  return options.filter(
    (o) =>
      (o.key === value || !excluded.has(o.key)) && (q === '' || normalizeText(o.display).includes(q))
  );
}

/** Three-character monogram: 'Aston Villa' -> 'AST', 'New York FC' -> 'NEW'. */
export function getMonogram(display: string, length = 3): string {
  const clean = display
    .normalize('NFC')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  const letters = Array.from(clean.replace(/ /g, '')).slice(0, length).join('');
  return letters === '' ? '•' : letters.toUpperCase();
}

/** Used only when two teams share the same prefix: 'Manchester City' -> 'MCI'. */
function getDisambiguatedMonogram(display: string, length = 3): string {
  const clean = display
    .normalize('NFC')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = clean.split(' ').filter(Boolean);
  if (words.length < 2) return getMonogram(display, length);
  const first = Array.from(words[0] ?? '')[0] ?? '';
  const tail = Array.from(words[words.length - 1] ?? '').slice(0, length - 1).join('');
  return (first + tail).toUpperCase();
}

function getShortCode(option: TeamOption): string | null {
  const code = (option as TeamOption & { short?: unknown }).short;
  return typeof code === 'string' && code.trim() !== ''
    ? code.trim().toUpperCase().slice(0, 3)
    : null;
}

/** Computed once per options array; resolves prefix collisions between teams. */
function buildMonograms(options: TeamOption[]): Map<string, string> {
  const entries = options.map((o) => {
    const short = getShortCode(o);
    return { option: o, explicit: short !== null, code: short ?? getMonogram(o.display) };
  });
  const counts = new Map<string, number>();
  entries.forEach(({ code }) => counts.set(code, (counts.get(code) ?? 0) + 1));
  const result = new Map<string, string>();
  entries.forEach(({ option, explicit, code }) => {
    const collides = !explicit && (counts.get(code) ?? 0) > 1;
    result.set(option.key, collides ? getDisambiguatedMonogram(option.display) : code);
  });
  return result;
}

/** Key-based, so the same team keeps its id while the list is being filtered. */
function optionId(baseId: string, key: string): string {
  return `${baseId}-opt-${Array.from(key).map((char) => char.codePointAt(0)?.toString(16)).join('-')}`;
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'input:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )
  );
}

function getOpeningKey(
  key: string,
  list: TeamOption[],
  selectedKey: string | null
): string | null {
  const fromEnd = key === 'ArrowUp' || key === 'End';
  const usesSelection = key === 'ArrowDown' || key === 'ArrowUp';
  if (usesSelection && selectedKey !== null) return selectedKey;
  const target = fromEnd ? list[list.length - 1] : list[0];
  return target?.key ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

/** SSR-safe, tear-free media query (server snapshot is `false`). */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    [query]
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * Desktop popover geometry. The first value is measured synchronously during
 * the initial render (the popover only mounts on the client, after the trigger
 * exists), so the search field can be focused immediately. Later updates are
 * coalesced to one measurement per animation frame.
 */
function usePopoverGeometry(
  triggerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  onTriggerOffscreen: () => void
): PopoverGeometry | null {
  const [geometry, setGeometry] = useState<PopoverGeometry | null>(() =>
    enabled ? readTriggerGeometry(triggerRef.current) : null
  );
  const offscreenRef = useRef(onTriggerOffscreen);
  useEffect(() => {
    offscreenRef.current = onTriggerOffscreen;
  }, [onTriggerOffscreen]);

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (isRectOutOfView(rect, window.innerHeight)) {
      offscreenRef.current();
      return;
    }
    const next = calculatePopoverGeometry(rect, {
      width: window.innerWidth,
      height: window.innerHeight
    });
    setGeometry((prev) => (prev && sameGeometry(prev, next) ? prev : next));
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!enabled) {
      setGeometry(null);
      return undefined;
    }
    measure();

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };
    const listenerOptions = { capture: true, passive: true } as const;
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, listenerOptions);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', schedule);
    vv?.addEventListener('scroll', schedule);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (observer && triggerRef.current) observer.observe(triggerRef.current);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, listenerOptions);
      vv?.removeEventListener('resize', schedule);
      vv?.removeEventListener('scroll', schedule);
      observer?.disconnect();
    };
  }, [enabled, measure, triggerRef]);

  return geometry;
}

/** Document-level outside press (pointer) and Escape handling. */
function useDismiss({
  triggerRef,
  popoverRef,
  outsidePress,
  onOutsidePress,
  onEscape
}: {
  triggerRef: RefObject<HTMLElement | null>;
  popoverRef: RefObject<HTMLElement | null>;
  outsidePress: boolean;
  onOutsidePress: () => void;
  onEscape: () => void;
}) {
  const handlers = useRef({ onOutsidePress, onEscape });
  useEffect(() => {
    handlers.current = { onOutsidePress, onEscape };
  }, [onOutsidePress, onEscape]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.isComposing) return;
      e.preventDefault();
      e.stopPropagation(); // keep parent dialogs open
      handlers.current.onEscape();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, []);

  useEffect(() => {
    if (!outsidePress) return undefined;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      handlers.current.onOutsidePress();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [outsidePress, popoverRef, triggerRef]);
}

/* Ref-counted body scroll lock: two instances never unlock each other. */
let scrollLockCount = 0;
let savedBodyStyle: { overflow: string; paddingRight: string } | null = null;

function lockScroll() {
  if (scrollLockCount++ > 0) return;
  const body = document.body;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  savedBodyStyle = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  body.style.overflow = 'hidden';
  if (scrollbar > 0) {
    const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbar}px`;
  }
}

function unlockScroll() {
  if (scrollLockCount === 0) return;
  if (--scrollLockCount > 0 || !savedBodyStyle) return;
  document.body.style.overflow = savedBodyStyle.overflow;
  document.body.style.paddingRight = savedBodyStyle.paddingRight;
  savedBodyStyle = null;
}

function useScrollLock(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return undefined;
    lockScroll();
    return unlockScroll;
  }, [active]);
}

/** Marks everything outside the sheet layer inert / aria-hidden while it is open. */
function useInertBackground(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return undefined;
    const changed: Array<{ el: HTMLElement; ariaHidden: string | null; inert: boolean }> = [];
    Array.from(document.body.children).forEach((el) => {
      if (!(el instanceof HTMLElement) || el.hasAttribute(LAYER_ATTR)) return;
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
      changed.push({
        el,
        ariaHidden: el.getAttribute('aria-hidden'),
        inert: el.hasAttribute('inert')
      });
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    });
    return () => {
      changed.forEach(({ el, ariaHidden, inert }) => {
        if (!inert) el.removeAttribute('inert');
        if (ariaHidden === null) el.removeAttribute('aria-hidden');
        else el.setAttribute('aria-hidden', ariaHidden);
      });
    };
  }, [active]);
}

/** Keeps Tab / Shift+Tab inside the modal sheet and pulls stray focus back. */
function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!active || !node) return undefined;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable(node);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const inside = current instanceof Node && node.contains(current);
      if (e.shiftKey && (current === first || !inside)) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && (current === last || !inside)) {
        e.preventDefault();
        first?.focus();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof Node && !node.contains(e.target)) {
        (getFocusable(node)[0] ?? node).focus();
      }
    };
    node.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [active, ref]);
}

/** Tracks the on-screen keyboard so the sheet stays above it. */
function useKeyboardViewport(active: boolean): { height: number; inset: number } | null {
  const [state, setState] = useState<{ height: number; inset: number } | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!active || !vv) return undefined;
    const read = () => {
      const height = Math.round(vv.height);
      const inset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      setState((prev) =>
        prev && prev.height === height && prev.inset === inset ? prev : { height, inset }
      );
    };
    read();
    vv.addEventListener('resize', read);
    vv.addEventListener('scroll', read);
    return () => {
      vv.removeEventListener('resize', read);
      vv.removeEventListener('scroll', read);
    };
  }, [active]);
  return active ? state : null;
}

/* -------------------------------------------------------------------------- */
/*  Presentational pieces                                                     */
/* -------------------------------------------------------------------------- */

interface TeamOptionRowProps {
  option: TeamOption;
  id: string;
  monogram: string;
  active: boolean;
  selected: boolean;
  onSelect: (key: string) => void;
  onHover: (key: string) => void;
}

const TeamOptionRow = memo(function TeamOptionRow({
  option,
  id,
  monogram,
  active,
  selected,
  onSelect,
  onHover
}: TeamOptionRowProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const key = e.currentTarget.dataset.key;
      if (key !== undefined) onSelect(key);
    },
    [onSelect]
  );
  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const key = e.currentTarget.dataset.key;
      if (key !== undefined) onHover(key);
    },
    [onHover]
  );

  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      data-key={option.key}
      onClick={handleClick}
      onMouseMove={handleMove}
      className={cn('team-option', active && 'is-focused')}
    >
      <span aria-hidden={true} className="team-monogram">
        {monogram}
      </span>
      <span className="team-option-name">{option.display}</span>
      <span className="team-option-meta">
        <span className="team-option-played" title="Lejátszott meccsek a szezonban">
          <span aria-hidden={true}>
            {option.played}
            <span className="team-option-played-unit"> M</span>
          </span>
          <span className="sr-only">, {option.played} lejátszott meccs</span>
        </span>
        {selected ? <Check className="team-option-check" aria-hidden={true} /> : null}
      </span>
    </div>
  );
});

class PopoverBoundary extends React.Component<
  { onError: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  override state: { failed: boolean } = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch() {
    this.props.onError();
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface TeamSelectPopoverProps {
  compact: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listboxId: string;
  baseId: string;
  copy: TeamSelectCopy;
  query: string;
  onQueryChange: (value: string) => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  rows: TeamOption[];
  totalCount: number;
  value: string | null;
  monograms: Map<string, string>;
  activeIndex: number;
  activeId: string | undefined;
  scrollOnActive: boolean;
  /** Mobile: only pull up the on-screen keyboard when the picker was opened by typing. */
  focusSearch: boolean;
  /** Mobile sheet subtitle, e.g. "1. sor, hazai csapat". */
  context: string;
  onSelect: (key: string) => void;
  onHover: (key: string) => void;
  onClose: (restoreFocus: boolean) => void;
}

function TeamSelectPopover({
  compact,
  triggerRef,
  listboxId,
  baseId,
  copy,
  query,
  onQueryChange,
  onInputKeyDown,
  rows,
  totalCount,
  value,
  monograms,
  activeIndex,
  activeId,
  scrollOnActive,
  focusSearch,
  context,
  onSelect,
  onHover,
  onClose
}: TeamSelectPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ startY: number; delta: number } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const titleId = `${baseId}-sheet-title`;
  const contextId = `${baseId}-sheet-context`;

  const closeFromScroll = useCallback(() => onClose(false), [onClose]);
  const geometry = usePopoverGeometry(triggerRef, !compact, closeFromScroll);
  const keyboard = useKeyboardViewport(compact);

  useDismiss({
    triggerRef,
    popoverRef,
    outsidePress: !compact, // compact mode: the backdrop is the single dismiss path
    onOutsidePress: () => onClose(false),
    onEscape: () => onClose(true)
  });
  useScrollLock(compact);
  useInertBackground(compact);
  useFocusTrap(popoverRef, compact);

  // Desktop: the geometry is measured in the first render, so the input is
  // already focusable here. Mobile: focusing the input would raise the
  // on-screen keyboard over the list, so the sheet itself takes focus and the
  // keyboard only appears once the user taps the search field.
  useLayoutEffect(() => {
    if (compact && !focusSearch) popoverRef.current?.focus({ preventScroll: true });
    else inputRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Swipe the sheet down by its header to dismiss it. */
  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const panel = popoverRef.current;
    if (!panel || (e.target instanceof Element && e.target.closest('button'))) return;
    dragRef.current = { startY: e.clientY, delta: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    panel.style.animation = 'none'; // the entry animation would otherwise pin transform
    panel.style.transition = 'none';
  };
  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const panel = popoverRef.current;
    if (!drag || !panel) return;
    drag.delta = Math.max(0, e.clientY - drag.startY);
    panel.style.transform = `translateY(${drag.delta}px)`;
  };
  const onDragEnd = () => {
    const drag = dragRef.current;
    const panel = popoverRef.current;
    dragRef.current = null;
    if (!drag || !panel) return;
    if (drag.delta > SWIPE_CLOSE_PX) {
      onClose(true);
      return;
    }
    panel.style.transition = 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
    panel.style.transform = '';
  };

  useEffect(() => {
    if (!scrollOnActive || !activeId) return;
    document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId, scrollOnActive]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setAnnouncement(totalCount === 0 ? copy.empty : `${totalCount} ${copy.countSuffix}`);
    }, ANNOUNCE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [totalCount, copy.empty, copy.countSuffix]);

  const keyboardOpen = keyboard !== null && keyboard.inset > KEYBOARD_INSET_THRESHOLD;
  // Alsó sheet: a vízszintes/lekerekítési értékeket a .team-panel.is-mobile adja,
  // inline csak a magasság és a billentyűzet feletti pozíció marad.
  // A fixed height (not max-height) keeps the sheet from jumping while the list
  // filters. With the keyboard up, the sheet fills all the space above it.
  const sheetStyle: React.CSSProperties = {
    height:
      keyboardOpen && keyboard
        ? Math.max(SHEET_MIN_HEIGHT, keyboard.height - SHEET_TOP_GAP)
        : `min(${SHEET_HEIGHT_DVH}dvh, calc(100dvh - env(safe-area-inset-top, 0px) - ${SHEET_TOP_GAP}px))`,
    bottom: keyboardOpen && keyboard ? keyboard.inset : undefined,
    paddingBottom: keyboardOpen ? 0 : undefined
  };
  const desktopStyle: React.CSSProperties = {
    left: geometry?.left ?? 0,
    top: geometry?.top,
    bottom: geometry?.bottom,
    width: geometry?.width ?? DESKTOP_MIN_WIDTH,
    maxHeight: geometry?.maxHeight ?? 320,
    visibility: geometry ? 'visible' : 'hidden'
  };

  return (
    <div {...{ [LAYER_ATTR]: '' }}>
      {compact ? (
        <div className="team-backdrop" onClick={() => onClose(true)} aria-hidden={true} />
      ) : null}
      <div
        ref={popoverRef}
        role={compact ? 'dialog' : undefined}
        aria-modal={compact ? true : undefined}
        aria-labelledby={compact ? titleId : undefined}
        aria-describedby={compact && context ? contextId : undefined}
        tabIndex={compact ? -1 : undefined}
        onKeyDown={(e) => { if (e.target === e.currentTarget) onInputKeyDown(e); }}
        className={cn('team-panel', compact ? 'is-mobile' : 'is-popover')}
        style={compact ? sheetStyle : desktopStyle}
      >
        {compact ? (
          <div
            className="team-sheet-grip"
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <div className="team-drag-handle" aria-hidden={true} />
            <div className="team-sheet-header">
              <div className="team-sheet-heading">
                <span id={titleId} className="team-sheet-title">
                  {copy.sheetLabel}
                </span>
                {context ? (
                  <span id={contextId} className="team-sheet-subtitle">
                    {context}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                title={copy.close}
                aria-label={copy.close}
                onClick={() => onClose(true)}
                className="btn team-sheet-close"
              >
                <X aria-hidden={true} />
              </button>
            </div>
          </div>
        ) : null}

        <div className="team-search-header">
          <div className="team-search-wrap">
            <Search className="team-search-icon" aria-hidden={true} />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="go"
              autoCapitalize="none"
              autoCorrect="off"
              data-1p-ignore="true"
              data-lpignore="true"
              data-form-type="other"
              role="combobox"
              aria-expanded={true}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              aria-label={copy.searchLabel}
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={copy.searchPlaceholder}
              className="team-search-input"
            />
          </div>
        </div>

        <div
          id={listboxId}
          role="listbox"
          aria-label={copy.listLabel}
          // keep DOM focus in the search input when pressing on an option
          onMouseDown={(e) => e.preventDefault()}
          className="team-list"
        >
          {rows.length === 0 ? (
            <div className="team-empty">
              <Search className="team-empty-icon" aria-hidden={true} />
              <p className="team-empty-text">{copy.empty}</p>
            </div>
          ) : (
            rows.map((o, index) => (
              <TeamOptionRow
                key={o.key}
                option={o}
                id={optionId(baseId, o.key)}
                monogram={monograms.get(o.key) ?? getMonogram(o.display)}
                active={index === activeIndex}
                selected={o.key === value}
                onSelect={onSelect}
                onHover={onHover}
              />
            ))
          )}
          {totalCount > rows.length ? <p className="team-hint">{copy.refineHint}</p> : null}
        </div>

        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>

        <div aria-hidden={true} className="team-footer">
          {totalCount} {copy.countSuffix}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The list is rendered in a portal on purpose. Every `Panel` in the app sets
 * `overflow-hidden`, so an absolutely positioned dropdown was clipped by the
 * panel — the 7th and 8th fixture rows of a round could never reach the bottom
 * of their own team list. A fixed-position portal escapes the clip, and the
 * geometry flips the list upwards when there is no room underneath.
 *
 * Interaction model: the trigger is a select-only combobox; once open, DOM focus
 * lives in the search input and the active option is exposed through
 * `aria-activedescendant`. Below 640px the popover becomes a modal bottom sheet.
 *
 * Styling lives in ./team-select.css (the `team-*` classes).
 */
export function TeamSelect({
  value,
  options,
  excluded,
  placeholder,
  disabled = false,
  onChange,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  copy: copyOverride,
  name
}: TeamSelectProps) {
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const triggerId = id ?? `${baseId}-trigger`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  // The active option is tracked by key, so it survives option/exclusion changes.
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [openedByTyping, setOpenedByTyping] = useState(false);

  const compact = useMediaQuery(COMPACT_QUERY);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalityRef = useRef<'keyboard' | 'pointer'>('keyboard');
  const restoreFocusRef = useRef(false);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const copy = useMemo<TeamSelectCopy>(
    () => ({ ...TEAM_SELECT_COPY, ...copyOverride }),
    [copyOverride]
  );

  const selected = useMemo(() => options.find((o) => o.key === value) ?? null, [options, value]);
  const monograms = useMemo(() => buildMonograms(options), [options]);
  const filtered = useMemo(
    () => filterTeams(options, { query, value, excluded }),
    [options, query, value, excluded]
  );
  const rows = useMemo(() => filtered.slice(0, MAX_RENDERED_OPTIONS), [filtered]);

  // Derived, never stored: always in range, -1 only for an empty list.
  const foundIndex = activeKey === null ? -1 : rows.findIndex((o) => o.key === activeKey);
  const activeIndex = rows.length === 0 ? -1 : foundIndex >= 0 ? foundIndex : 0;
  const activeOption = activeIndex >= 0 ? rows[activeIndex] : null;
  const activeId = activeOption ? optionId(baseId, activeOption.key) : undefined;

  useEffect(() => {
    if (IS_DEV && value !== null && !selected) {
      console.warn(`TeamSelect: value "${value}" was not found in options.`);
    }
  }, [selected, value]);

  const openWith = useCallback(
    (init: { activeKey?: string | null; query?: string } = {}) => {
      if (disabled) return;
      modalityRef.current = 'keyboard';
      setOpenedByTyping(Boolean(init.query));
      setQuery(init.query ?? '');
      setActiveKey(init.activeKey !== undefined ? init.activeKey : value);
      setOpen(true);
    },
    [disabled, value]
  );

  const close = useCallback((restoreFocus: boolean) => {
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
    setQuery('');
    setActiveKey(null);
  }, []);

  // Focus is restored after the popover (and its focus trap / inert state) has
  // been torn down, so the trigger is focusable again.
  useLayoutEffect(() => {
    if (open || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    triggerRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (disabled && open) close(true);
  }, [close, disabled, open]);

  const pick = useCallback(
    (key: string) => {
      onChangeRef.current(key);
      close(true);
    },
    [close]
  );

  const handleHover = useCallback((key: string) => {
    modalityRef.current = 'pointer';
    setActiveKey(key);
  }, []);

  const handleQueryChange = useCallback((next: string) => {
    setQuery(next);
    setActiveKey(null); // derived index falls back to the first match
  }, []);

  const moveTo = (index: number) => {
    if (rows.length === 0) return;
    modalityRef.current = 'keyboard';
    const clamped = Math.max(0, Math.min(rows.length - 1, index));
    setActiveKey(rows[clamped]?.key ?? null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.nativeEvent.isComposing) return; // IME safety
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveTo(activeIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveTo(activeIndex - 1);
        break;
      case 'PageDown':
        e.preventDefault();
        moveTo(activeIndex + PAGE_STEP);
        break;
      case 'PageUp':
        e.preventDefault();
        moveTo(activeIndex - PAGE_STEP);
        break;
      case 'Home':
        // keep native caret movement unless the field is empty or Ctrl is held
        if (query === '' || e.ctrlKey) {
          e.preventDefault();
          moveTo(0);
        }
        break;
      case 'End':
        if (query === '' || e.ctrlKey) {
          e.preventDefault();
          moveTo(rows.length - 1);
        }
        break;
      case 'Enter':
        if (activeOption) {
          e.preventDefault();
          pick(activeOption.key);
        }
        break;
      case 'Tab':
        // Desktop: close and let the browser continue from the trigger.
        // Sheet: the focus trap keeps focus inside.
        if (!compact) close(true);
        break;
      default:
        break;
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (open || e.nativeEvent.isComposing) return;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const list = filterTeams(options, { query: '', value, excluded });
      openWith({ activeKey: getOpeningKey(e.key, list, selected?.key ?? null) });
      return;
    }
    const printable = e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (printable) {
      e.preventDefault();
      openWith({ query: e.key, activeKey: null });
    }
  };

  const triggerName = ariaLabel ?? placeholder;
  const triggerLabel = selected ? `${triggerName}: ${selected.display}` : triggerName;

  return (
    <div className={cn('team-dropdown', selected && 'is-active')}>
      <div className="team-select-row">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          disabled={disabled}
          aria-haspopup={compact ? 'dialog' : 'listbox'}
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={ariaLabelledBy}
          aria-label={ariaLabelledBy ? undefined : triggerLabel}
          onClick={() => (open ? close(true) : openWith())}
          onKeyDown={handleTriggerKeyDown}
          className="btn team-trigger"
        >
          <span className="team-trigger-content">
            {selected ? (
              <>
                <span aria-hidden={true} className="team-monogram">
                  {monograms.get(selected.key) ?? getMonogram(selected.display)}
                </span>
                <span className="team-trigger-name">{selected.display}</span>
              </>
            ) : (
              <span className="team-trigger-placeholder">{placeholder}</span>
            )}
          </span>
          <ChevronDown className="team-chevron" aria-hidden={true} />
        </button>
        {selected && !disabled ? (
          <button
            type="button"
            title={copy.removeLabel(selected.display)}
            aria-label={copy.removeLabel(selected.display)}
            onClick={() => {
              onChange(null);
              close(true);
              triggerRef.current?.focus();
            }}
            className="btn team-clear"
          >
            <X aria-hidden={true} />
          </button>
        ) : null}
      </div>

      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}

      {open && typeof document !== 'undefined'
        ? createPortal(
            <PopoverBoundary onError={() => close(true)}>
              <TeamSelectPopover
                key={compact ? "sheet" : "popover"}
                compact={compact}
                triggerRef={triggerRef}
                listboxId={listboxId}
                baseId={baseId}
                copy={copy}
                query={query}
                onQueryChange={handleQueryChange}
                onInputKeyDown={handleInputKeyDown}
                rows={rows}
                totalCount={filtered.length}
                value={value}
                monograms={monograms}
                activeIndex={activeIndex}
                activeId={activeId}
                scrollOnActive={modalityRef.current === 'keyboard'}
                focusSearch={openedByTyping}
                context={triggerName}
                onSelect={pick}
                onHover={handleHover}
                onClose={close}
              />
            </PopoverBoundary>,
            document.body
          )
        : null}
    </div>
  );
}
