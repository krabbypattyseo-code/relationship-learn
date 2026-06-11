'use client';

import {
  Compass,
  MessageCircle,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { MODES, USER_ACCENTS } from '@/lib/modes';
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
          </button>
        );
      })}
    </div>
  );
}
