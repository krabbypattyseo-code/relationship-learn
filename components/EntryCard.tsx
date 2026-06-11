import { MODE_COLORS } from '@/lib/modes';
import { formatDate, getPreviewText } from '@/lib/utils';
import type { EntryCardProps } from '@/types';

export default function EntryCard({ entry, onClick }: EntryCardProps) {
  const badgeClass = MODE_COLORS[entry.mode] ?? 'bg-gray-100 text-gray-800';
  const title = entry.title ?? getPreviewText(entry.messages).slice(0, 60);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-3xl bg-white p-5 text-left shadow-md ring-1 ring-rgp-green/5 transition hover:shadow-lg hover:ring-rgp-yellow/40"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          /{entry.mode}
        </span>
        <span className="text-xs text-rgp-muted">{formatDate(entry.created_at)}</span>
      </div>
      <h3 className="mb-2 font-semibold text-rgp-charcoal line-clamp-1">{title}</h3>
      <p className="text-sm text-rgp-muted line-clamp-2">
        {getPreviewText(entry.messages)}
      </p>
    </button>
  );
}
