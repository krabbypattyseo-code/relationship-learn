'use client';

import Link from 'next/link';
import type { Mode, ModeScoreData, ScoreDelta, UserId } from '@/types';
import { buildScoreDeltas } from '@/lib/mode-scoring';

interface SessionScoreCardProps {
  userId: UserId;
  mode: Mode;
  sessionScore: ModeScoreData;
  historicalScore: ModeScoreData | null;
  saving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

function trendIcon(trend: ScoreDelta['trend']) {
  if (trend === 'up') return '↑';
  if (trend === 'down') return '↓';
  return '→';
}

function dimensionLabel(dim: string): string {
  return dim.replace(/_/g, ' ');
}

export default function SessionScoreCard({
  userId,
  mode,
  sessionScore,
  historicalScore,
  saving,
  onSave,
  onDiscard,
}: SessionScoreCardProps) {
  const deltas = buildScoreDeltas(mode, sessionScore, historicalScore);

  if (mode === 'growth') {
    const g = sessionScore as {
      self_awareness?: number;
      self_regulation?: number;
      empathy?: number;
      social_skill?: number;
      narrative?: string;
      focus_next?: string;
    };
    return (
      <div className="mx-4 mb-4 rounded-2xl border-2 border-rgp-yellow/50 bg-rgp-yellow/10 p-4">
        <h3 className="mb-3 text-sm font-bold text-rgp-charcoal">Growth Session Score</h3>
        {g.narrative && (
          <p className="mb-2 text-sm text-rgp-muted">{g.narrative}</p>
        )}
        {g.focus_next && (
          <p className="mb-3 text-xs font-medium text-rgp-green">Focus: {g.focus_next}</p>
        )}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(['self_awareness', 'self_regulation', 'empathy', 'social_skill'] as const).map(
            (key) =>
              g[key] != null && (
                <div key={key} className="rounded-xl bg-white/90 px-3 py-2 text-center">
                  <p className="text-[10px] capitalize text-rgp-muted">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xl font-bold text-rgp-green">{g[key]}</p>
                </div>
              )
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-full bg-rgp-green px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan sesi ini'}
          </button>
          <button type="button" onClick={onDiscard} disabled={saving} className="rounded-full border px-5 py-2 text-sm text-rgp-muted">
            Buang
          </button>
        </div>
      </div>
    );
  }

  const analisisScore = sessionScore as { cortisol?: number };
  const showNudge = mode === 'analisis' && (analisisScore.cortisol ?? 100) < 40;

  return (
    <div className="mx-4 mb-4 rounded-2xl border-2 border-rgp-yellow/50 bg-rgp-yellow/10 p-4">
      <h3 className="mb-3 text-sm font-bold text-rgp-charcoal">Session Score</h3>

      <div className="space-y-2">
        {deltas.map((d) => (
          <div
            key={d.dimension}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/90 px-3 py-2 text-sm"
          >
            <span className="capitalize text-rgp-muted">{dimensionLabel(d.dimension)}</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-rgp-green">{d.session}</span>
              <span
                className={`text-xs font-medium ${
                  d.trend === 'up'
                    ? 'text-emerald-600'
                    : d.trend === 'down'
                      ? 'text-red-600'
                      : 'text-rgp-muted'
                }`}
              >
                {trendIcon(d.trend)} {d.delta > 0 ? `+${d.delta}` : d.delta === 0 ? 'sama' : d.delta}
              </span>
              {historicalScore && (
                <span className="text-xs text-rgp-muted">vs {d.historical}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showNudge && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <p className="font-medium">Tension di sesi ini cukup tinggi.</p>
          <p className="mt-1">Pertimbangkan /plan atau /conversation sebagai follow-up.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={`/${userId}/chat?mode=plan`}
              className="rounded-full bg-rgp-green px-3 py-1 text-white"
            >
              Lanjut ke /plan
            </Link>
            <Link
              href={`/${userId}/chat?mode=conversation`}
              className="rounded-full border border-rgp-green px-3 py-1 text-rgp-green"
            >
              Lanjut ke /conversation
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-rgp-green px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Menyimpan...' : 'Simpan sesi ini'}
        </button>
        <button
          type="button"
          onClick={onDiscard}
          disabled={saving}
          className="rounded-full border border-rgp-green/30 px-5 py-2 text-sm font-medium text-rgp-muted hover:bg-white disabled:opacity-50"
        >
          Buang
        </button>
      </div>
    </div>
  );
}
