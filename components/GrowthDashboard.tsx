'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import GrowthScorePanel from '@/components/GrowthScorePanel';
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

export default function GrowthDashboard({
  entries,
  snapshot,
  userId,
  variant = 'private',
}: GrowthDashboardProps) {
  const chartData = getWeeklyActivity(entries);
  const showChart = variant === 'private';

  return (
    <div className="space-y-8">
      <GrowthScorePanel
        snapshot={snapshot}
        variant={variant}
        userId={userId}
        showRefresh={variant === 'private'}
      />

      {showChart && (
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
      )}
    </div>
  );
}
