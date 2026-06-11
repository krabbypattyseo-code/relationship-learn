'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { BOOK_LIBRARY, getBooksForMode } from '@/lib/books';
import type { Mode } from '@/types';

interface BookLibraryProps {
  compact?: boolean;
  highlightMode?: Mode;
}

export default function BookLibrary({ compact = false, highlightMode }: BookLibraryProps) {
  const [open, setOpen] = useState(!compact);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const highlighted = highlightMode ? getBooksForMode(highlightMode) : [];
  const displayBooks = highlightMode ? highlighted : BOOK_LIBRARY;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-rgp-green/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-rgp-green/10 p-2 text-rgp-green">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-rgp-charcoal">Theoretical Library</h2>
            <p className="text-sm text-rgp-muted">
              {BOOK_LIBRARY.length} buku · neuroscience, attachment, EQ, love languages
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-rgp-muted" />
        ) : (
          <ChevronDown className="h-5 w-5 text-rgp-muted" />
        )}
      </button>

      {open && (
        <div className="mt-6 space-y-3 border-t border-rgp-cream pt-6">
          {highlightMode && (
            <p className="text-sm text-rgp-green">
              Priority books for <strong>{highlightMode}</strong> mode:
            </p>
          )}

          {displayBooks.map((book) => {
            const isExpanded = expandedId === book.id;

            return (
              <div
                key={book.id}
                className="rounded-2xl border border-rgp-green/10 bg-rgp-cream/50"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : book.id)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-rgp-green">
                      {book.domain}
                    </p>
                    <h3 className="mt-1 font-semibold text-rgp-charcoal">
                      {book.author} — <em>{book.title}</em>
                    </h3>
                    {!isExpanded && (
                      <p className="mt-1 text-sm text-rgp-muted line-clamp-2">
                        {book.coreTheory}
                      </p>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-rgp-muted" />
                  ) : (
                    <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-rgp-muted" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-3 border-t border-rgp-green/10 px-4 pb-4 pt-3 text-sm">
                    <div>
                      <p className="font-semibold text-rgp-charcoal">Core Theory</p>
                      <p className="mt-1 text-rgp-muted">{book.coreTheory}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-rgp-charcoal">Key Concepts</p>
                      <ul className="mt-1 list-inside list-disc text-rgp-muted">
                        {book.keyConcepts.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-rgp-charcoal">RGP Application</p>
                      <p className="mt-1 text-rgp-muted">{book.applicationToRGP}</p>
                    </div>
                    <p className="text-xs text-rgp-green">
                      Modes: {book.primaryModes.map((m) => `/${m}`).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
