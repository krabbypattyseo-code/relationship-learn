'use client';

import type { Mode, ModeHistoricalResponse, ModeScoreData } from '@/types';
import { getReadinessLabel } from '@/lib/mode-scoring';
import { MODE_COLORS } from '@/lib/modes';

interface ModeScoreHeaderProps {
  mode: Mode;
  data: ModeHistoricalResponse | null;
  loading?: boolean;
}

const MODE_LABELS: Record<Mode, string> = {
  reflect: 'Oxytocin · Serotonin',
  analisis: 'Stress · Self-regulation',
  plan: 'Dopamine · Social Skill',
  conversation: 'Readiness (Oxy · Self-reg · Empathy)',
  growth: 'Full Growth Review',
};

function formatScoreLines(mode: Mode, score: ModeScoreData | null): string {
  if (!score) return '—';
  switch (mode) {
    case 'reflect':
      return `Oxytocin ${(score as { oxytocin: number }).oxytocin} · Serotonin ${(score as { serotonin: number }).serotonin}`;
    case 'analisis':
      return `Stress ${(score as { cortisol: number }).cortisol} · Self-reg ${(score as { self_regulation: number }).self_regulation}`;
    case 'plan':
      return `Dopamine ${(score as { dopamine: number }).dopamine} · Social ${(score as { social_skill: number }).social_skill}`;
    case 'conversation': {
      const c = score as { readiness: number };
      return `Readiness ${c.readiness} — ${getReadinessLabel(c.readiness)}`;
    }
    default:
      return '—';
  }
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-rgp-green/10">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

export default function ModeScoreHeader({ mode, data, loading }: ModeScoreHeaderProps) {
  if (mode === 'growth') return null;

  const colorClass = MODE_COLORS[mode] ?? 'bg-rgp-cream text-rgp-charcoal';
  const score = data?.historicalAvg ?? null;

  return (
    <div className="mb-4 rounded-2xl border border-rgp-green/10 bg-rgp-cream/80 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
            /{mode}
          </span>
          <span className="text-xs text-rgp-muted">Baseline minggu ini</span>
        </div>
        {loading ? (
          <span className="text-xs text-rgp-muted">Memuat score...</span>
        ) : (
          <span className="text-xs font-medium text-rgp-green">
            {formatScoreLines(mode, score)}
          </span>
        )}
      </div>

      {!loading && score && mode === 'reflect' && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-rgp-muted">
            <span className="w-16">Oxytocin</span>
            <ScoreBar value={(score as { oxytocin: number }).oxytocin} color="#7C3AED" />
            <span className="w-6 text-right">{(score as { oxytocin: number }).oxytocin}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-rgp-muted">
            <span className="w-16">Serotonin</span>
            <ScoreBar value={(score as { serotonin: number }).serotonin} color="#059669" />
            <span className="w-6 text-right">{(score as { serotonin: number }).serotonin}</span>
          </div>
        </div>
      )}

      {!loading && data && (
        <p className="mt-2 text-[10px] text-rgp-muted">
          Dari {data.sessionCount} sesi · trend{' '}
          {data.trend === 'improving' ? '↑ membaik' : data.trend === 'declining' ? '↓ turun' : '→ stabil'}
          {' · '}
          {MODE_LABELS[mode]}
        </p>
      )}

      {!loading && !data?.historicalAvg && (
        <p className="mt-2 text-[10px] text-rgp-muted">
          Belum ada baseline — score muncul setelah sesi pertama disimpan.
        </p>
      )}
    </div>
  );
}
