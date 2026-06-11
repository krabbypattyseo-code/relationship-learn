'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  questionCategories,
  totalQuestions,
  type QuestionCategory,
} from '@/lib/data/perlu-diobrolin-questions';

type QuestionStatus = 'belum' | 'diobrolin' | 'selesai';

interface QuestionAnswer {
  status: QuestionStatus;
  haristPOV: string;
  dianPOV: string;
}

type AnswersMap = Record<string, QuestionAnswer>;

const STORAGE_KEY = 'rgp-perlu-diobrolin-answers';

const defaultAnswer = (): QuestionAnswer => ({
  status: 'belum',
  haristPOV: '',
  dianPOV: '',
});

const statusLabels: Record<QuestionStatus, string> = {
  belum: 'Belum',
  diobrolin: 'Sudah diobrolin',
  selesai: 'Selesai',
};

const statusColors: Record<QuestionStatus, string> = {
  belum: 'bg-gray-100 text-gray-600',
  diobrolin: 'bg-rgp-yellow/30 text-rgp-charcoal',
  selesai: 'bg-rgp-green/10 text-rgp-green',
};

function loadAnswers(): AnswersMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnswersMap) : {};
  } catch {
    return {};
  }
}

function saveAnswers(answers: AnswersMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export default function QuestionsWorksheet() {
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [activeCategory, setActiveCategory] = useState<string>(
    questionCategories[0]?.id ?? ''
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAnswers(loadAnswers());
    setHydrated(true);
  }, []);

  const updateAnswer = useCallback(
    (questionId: string, patch: Partial<QuestionAnswer>) => {
      setAnswers((prev) => {
        const next = {
          ...prev,
          [questionId]: { ...defaultAnswer(), ...prev[questionId], ...patch },
        };
        saveAnswers(next);
        return next;
      });
    },
    []
  );

  const stats = useMemo(() => {
    let diobrolin = 0;
    let selesai = 0;
    for (const cat of questionCategories) {
      for (const q of cat.questions) {
        const s = answers[q.id]?.status ?? 'belum';
        if (s === 'diobrolin') diobrolin++;
        if (s === 'selesai') selesai++;
      }
    }
    return { diobrolin, selesai, done: diobrolin + selesai };
  }, [answers]);

  const category = questionCategories.find((c) => c.id === activeCategory);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!hydrated) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-rgp-muted ring-1 ring-rgp-green/5">
        Memuat worksheet...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 ring-1 ring-rgp-green/5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-rgp-muted">Progress obrolan</span>
          <span className="font-medium text-rgp-green">
            {stats.done} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-rgp-green/10">
          <div
            className="h-full rounded-full bg-rgp-green transition-all"
            style={{ width: `${(stats.done / totalQuestions) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-rgp-muted">
          {stats.selesai} selesai · {stats.diobrolin} sudah diobrolin ·{' '}
          {totalQuestions - stats.done} belum
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {questionCategories.map((cat) => {
          const catDone = cat.questions.filter((q) => {
            const s = answers[q.id]?.status ?? 'belum';
            return s !== 'belum';
          }).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                activeCategory === cat.id
                  ? 'bg-rgp-green text-white'
                  : 'bg-white text-rgp-muted ring-1 ring-rgp-green/10 hover:ring-rgp-green/25'
              }`}
            >
              {cat.name}
              <span className="ml-1.5 opacity-70">
                ({catDone}/{cat.questions.length})
              </span>
            </button>
          );
        })}
      </div>

      {category && (
        <CategorySection
          category={category}
          answers={answers}
          expanded={expanded}
          onToggle={toggleExpanded}
          onUpdate={updateAnswer}
        />
      )}

      <div className="rounded-2xl border border-rgp-yellow/40 bg-rgp-yellow/10 p-5">
        <p className="text-sm font-medium text-rgp-charcoal">
          Sudah punya jawaban? Lanjut ke Conversation mode
        </p>
        <p className="mt-1 text-xs text-rgp-muted">
          Gunakan insight dari worksheet ini sebagai bahan obrolan lebih dalam dengan Claude.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/harist/chat?mode=conversation"
            className="rounded-full bg-rgp-harist px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            Harist — Conversation
          </Link>
          <Link
            href="/dian/chat?mode=conversation"
            className="rounded-full bg-rgp-dian px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            Dian — Conversation
          </Link>
        </div>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  answers,
  expanded,
  onToggle,
  onUpdate,
}: {
  category: QuestionCategory;
  answers: AnswersMap;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: Partial<QuestionAnswer>) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-rgp-green">{category.name}</h2>
      {category.questions.map((q, idx) => {
        const answer = answers[q.id] ?? defaultAnswer();
        const isOpen = expanded.has(q.id);

        return (
          <div
            key={q.id}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-rgp-green/5"
          >
            <button
              type="button"
              onClick={() => onToggle(q.id)}
              className="flex w-full items-start gap-3 p-4 text-left hover:bg-rgp-cream/50"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rgp-green/10 text-xs font-semibold text-rgp-green">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-rgp-charcoal">{q.text}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusColors[answer.status]}`}
                >
                  {statusLabels[answer.status]}
                </span>
              </div>
              <span className="shrink-0 text-rgp-muted">{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
              <div className="space-y-4 border-t border-rgp-green/5 px-4 pb-4 pt-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-rgp-muted">
                    Status
                  </label>
                  <select
                    value={answer.status}
                    onChange={(e) =>
                      onUpdate(q.id, { status: e.target.value as QuestionStatus })
                    }
                    className="w-full rounded-lg border border-rgp-green/15 bg-rgp-cream px-3 py-2 text-sm focus:border-rgp-green focus:outline-none"
                  >
                    {(Object.keys(statusLabels) as QuestionStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-rgp-harist">
                    Harist POV
                  </label>
                  <textarea
                    value={answer.haristPOV}
                    onChange={(e) => onUpdate(q.id, { haristPOV: e.target.value })}
                    rows={3}
                    placeholder="Perspektif Harist..."
                    className="w-full resize-y rounded-lg border border-rgp-green/15 bg-rgp-cream px-3 py-2 text-sm focus:border-rgp-harist focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-rgp-dian">
                    Dian POV
                  </label>
                  <textarea
                    value={answer.dianPOV}
                    onChange={(e) => onUpdate(q.id, { dianPOV: e.target.value })}
                    rows={3}
                    placeholder="Perspektif Dian..."
                    className="w-full resize-y rounded-lg border border-rgp-green/15 bg-rgp-cream px-3 py-2 text-sm focus:border-rgp-dian focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
