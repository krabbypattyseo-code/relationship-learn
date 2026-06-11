'use client';

import {
  Compass,
  MessageCircle,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { MODES, USER_ACCENTS } from '@/lib/modes';
import { getBooksForMode } from '@/lib/books';
import type { ModeSelectorProps, Mode } from '@/types';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mirror: Sparkles,
  search: Search,
  compass: Compass,
  message: MessageCircle,
  trending: TrendingUp,
};

export default function ModeSelector({ userId, onSelect }: ModeSelectorProps) {
  const accent = USER_ACCENTS[userId];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {MODES.map((mode) => {
        const Icon = ICONS[mode.icon] ?? Sparkles;
        const priorityBooks = getBooksForMode(mode.id as Mode);

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelect(mode.id as Mode)}
            className={`group rounded-3xl border-2 border-transparent bg-white p-6 text-left shadow-md transition hover:border-rgp-yellow hover:shadow-lg ${accent.border}`}
          >
            <div className="mb-4 inline-flex rounded-2xl bg-rgp-cream p-3 text-rgp-green transition group-hover:bg-rgp-yellow/20">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-rgp-charcoal">{mode.label}</h3>
            <p className="mt-1 text-sm text-rgp-muted">{mode.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
            {priorityBooks.slice(0, 4).map((book) => (
                <span
                  key={book.id}
                  className="rounded-full bg-rgp-green/5 px-2 py-0.5 text-xs text-rgp-green"
                >
                  {book.title === 'The Female Brain' || book.title === 'The Male Brain'
                    ? book.title.replace('The ', '')
                    : book.author.split(' ').pop()}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
