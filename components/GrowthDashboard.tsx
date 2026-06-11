'use client';

import Link from 'next/link';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import EntryCard from '@/components/EntryCard';
import { MODES } from '@/lib/modes';
import type { GrowthDashboardProps, ChatEntry } from '@/types';

function getWeeklyActivity(entries: ChatEntry[]) {
  const weeks: Record<string, number> = {};

  entries.forEach((entry) => {
    const date = new Date(entry.created_at);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
    weeks[key] = (weeks[key] ?? 0) + 1;
  });

  return Object.entries(weeks)
    .map(([week, count]) => ({ week, count }))
    .slice(0, 8)
    .reverse();
}

function getStreak(entries: ChatEntry[]): number {
  if (entries.length === 0) return 0;

  const days = new Set(
    entries.map((e) => new Date(e.created_at).toDateString())
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

function getTopMode(entries: ChatEntry[]): string {
  if (entries.length === 0) return '—';

  const counts: Record<string, number> = {};
  entries.forEach((e) => {
    counts[e.mode] = (counts[e.mode] ?? 0) + 1;
  });

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? `/${top[0]}` : '—';
}

export default function GrowthDashboard({ userId, entries }: GrowthDashboardProps) {
  const chartData = getWeeklyActivity(entries);
  const streak = getStreak(entries);
  const topMode = getTopMode(entries);
  const recent = entries.slice(0, 5);

  const stats = [
    { label: 'Total Entri', value: entries.length },
    { label: 'Streak Minggu Ini', value: streak },
    { label: 'Mode Terpopuler', value: topMode },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-rgp-green/5"
          >
            <p className="text-sm text-rgp-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-rgp-green">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-rgp-green/5">
        <h2 className="mb-6 text-lg font-bold text-rgp-charcoal">Aktivitas per Minggu</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#074836" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-rgp-muted">Belum ada data aktivitas.</p>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-rgp-charcoal">Entri Terbaru</h2>
          <Link
            href={`/${userId}/chat?mode=growth`}
            className="rounded-full bg-rgp-yellow px-4 py-2 text-sm font-semibold text-rgp-charcoal transition hover:bg-rgp-yellow-soft"
          >
            Mulai /growth review
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {recent.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onClick={() => {
                  window.location.href = `/${userId}/entries/${entry.id}`;
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-rgp-cream p-8 text-center text-rgp-muted">
            <p>Belum ada entri. Pilih mode untuk mulai journaling.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {MODES.slice(0, 3).map((m) => (
                <Link
                  key={m.id}
                  href={`/${userId}/chat?mode=${m.id}`}
                  className="rounded-full border border-rgp-green/20 px-3 py-1 text-xs text-rgp-green hover:bg-white"
                >
                  {m.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
