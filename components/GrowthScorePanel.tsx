'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { GrowthScoreSnapshot, HormoneScore, UserId } from '@/types';
import {
  getERDimensionHint,
  getHormoneHint,
  getScoreBand,
  getStressLevelLabel,
} from '@/lib/scoring-ui';

interface GrowthScorePanelProps {
  snapshot: GrowthScoreSnapshot;
  variant?: 'private' | 'shared';
  userId?: UserId;
  showRefresh?: boolean;
}

const HORMONE_LABELS: Record<keyof HormoneScore, { title: string; subtitle: string }> = {
  oxytocin: { title: 'Oxytocin', subtitle: 'Bonding & connection' },
  dopamine: { title: 'Dopamine', subtitle: 'Motivasi & reward' },
  serotonin: { title: 'Serotonin', subtitle: 'Stabilitas & regularity' },
  cortisol: { title: 'Stress Level', subtitle: 'Inverse — rendah = baik' },
};

const ER_LABELS = {
  self_awareness: 'Self-awareness',
  self_regulation: 'Self-regulation',
  empathy: 'Empathy',
  social_skill: 'Social skill',
} as const;

function ScoreCard({
  label,
  subtitle,
  score,
  displayValue,
  hint,
  compact,
}: {
  label: string;
  subtitle: string;
  score: number;
  displayValue?: string;
  hint?: string | null;
  compact?: boolean;
}) {
  const band = getScoreBand(score);
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-rgp-green/5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-rgp-muted">
            {label}
          </p>
          {!compact && <p className="text-[10px] text-rgp-muted">{subtitle}</p>}
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
          style={{ background: band.color }}
        >
          {band.label}
        </span>
      </div>
      <p className="mt-2 text-3xl font-bold" style={{ color: band.color }}>
        {displayValue ?? score}
      </p>
      {!compact && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-rgp-green/10">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${score}%`, background: band.color }}
          />
        </div>
      )}
      {hint && !compact && (
        <p className="mt-2 text-xs leading-relaxed text-rgp-muted">{hint}</p>
      )}
    </div>
  );
}

export default function GrowthScorePanel({
  snapshot: initialSnapshot,
  variant = 'private',
  userId,
  showRefresh = false,
}: GrowthScorePanelProps) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [refreshing, setRefreshing] = useState(false);
  const isShared = variant === 'shared';

  useEffect(() => {
    setSnapshot(initialSnapshot);
  }, [initialSnapshot]);

  const updated = new Date(snapshot.lastUpdated).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  async function handleRefresh() {
    if (!userId || refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.snapshot) setSnapshot(data.snapshot);
        router.refresh();
      }
    } finally {
      setRefreshing(false);
    }
  }

  const hormoneEntries = (
    Object.entries(HORMONE_LABELS) as [keyof HormoneScore, (typeof HORMONE_LABELS)[keyof HormoneScore]][]
  ).map(([key, meta]) => {
    const score = snapshot.hormone[key];
    const displayValue =
      key === 'cortisol' ? getStressLevelLabel(score) : undefined;
    const hint = getHormoneHint(key, score);
    return (
      <ScoreCard
        key={key}
        label={meta.title}
        subtitle={meta.subtitle}
        score={score}
        displayValue={displayValue}
        hint={hint}
        compact={isShared}
      />
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-rgp-charcoal">Hormone Performance</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-rgp-green/10 px-3 py-1 text-xs text-rgp-green">
              Updated: {updated}
            </span>
            {showRefresh && userId && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 rounded-full border border-rgp-green/20 px-3 py-1 text-xs font-medium text-rgp-green transition hover:bg-rgp-green/5 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Score
              </button>
            )}
          </div>
        </div>
        <p className="mb-4 text-xs text-rgp-muted">
          Periode {snapshot.periodStart} — {snapshot.periodEnd} · {snapshot.entriesCount}{' '}
          entri · hormone auto-update saat entri baru
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{hormoneEntries}</div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-rgp-charcoal">Emotion Regulation</h2>
        {snapshot.er ? (
          <div className="space-y-4">
            <ScoreCard
              label="Composite ER Score"
              subtitle="Weighted Goleman average · max 1x/24 jam"
              score={snapshot.er.composite}
              compact={isShared}
            />
            {!isShared && (
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  Object.keys(ER_LABELS) as Array<keyof typeof ER_LABELS>
                ).map((key) => {
                  const score = snapshot.er![key];
                  const hint = score < 60 ? getERDimensionHint(key) : null;
                  return (
                    <ScoreCard
                      key={key}
                      label={ER_LABELS[key]}
                      subtitle="Goleman dimension"
                      score={score}
                      hint={hint}
                    />
                  );
                })}
              </div>
            )}
            {!isShared && snapshot.er.rationale && (
              <p className="rounded-xl bg-rgp-cream px-4 py-3 text-sm text-rgp-muted">
                {snapshot.er.rationale}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-rgp-green/20 bg-white px-6 py-8 text-center">
            <p className="text-sm text-rgp-muted">
              ER Score belum tersedia. Jalankan sesi{' '}
              <span className="font-semibold text-rgp-green">/growth</span> untuk generate
              Emotion Regulation score (1 Claude call, cache 24 jam).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
