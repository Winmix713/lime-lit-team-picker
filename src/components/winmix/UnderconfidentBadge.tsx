import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { CoreEvidenceSnapshot, BandDiagnosis } from '../../types/winmix';

interface UnderconfidentBadgeProps {
  snapshot: CoreEvidenceSnapshot | null | undefined;
  diagnosis?: BandDiagnosis | null | undefined;
  className?: string;
}

export function UnderconfidentBadge({ snapshot, diagnosis, className }: UnderconfidentBadgeProps) {
  const isUnderconfident =
    (snapshot?.diagnosis === 'underconfident') ||
    (diagnosis === 'underconfident');

  if (!isUnderconfident) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border border-signal/30 bg-signal/[0.07] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-label text-signal ${className ?? ''}`}
      title="A modell alulbecsüli a BTTS valószínűséget — a tényleges beválás a jelzés FELETT van. A sor biztonságosabb, mint a modell jelzi. Feltételes, nem cáfolt."
    >
      <TrendingUp className="h-3 w-3" aria-hidden={true} />
      Alulbecsült
    </span>
  );
}
