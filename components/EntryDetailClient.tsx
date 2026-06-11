'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import Header from '@/components/Header';
import UserNav from '@/components/UserNav';
import { MODE_COLORS } from '@/lib/modes';
import { exportToPDF, formatDate } from '@/lib/utils';
import MessageProse from '@/components/MessageProse';
import type { ChatEntry } from '@/types';

interface EntryDetailProps {
  entry: ChatEntry;
  userId: 'harist' | 'dian';
  userLabel: string;
}

export default function EntryDetailClient({
  entry,
  userId,
  userLabel,
}: EntryDetailProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeClass = MODE_COLORS[entry.mode] ?? 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-10 lg:px-12">
        <UserNav userId={userId} userLabel={userLabel} />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
              /{entry.mode}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-rgp-charcoal">
              {entry.title ?? 'Untitled'}
            </h1>
            <p className="mt-1 text-sm text-rgp-muted">{formatDate(entry.created_at)}</p>
          </div>
          <button
            type="button"
            onClick={() => exportToPDF(contentRef, `rgp-entry-${entry.id}.pdf`)}
            className="inline-flex items-center gap-2 rounded-full bg-rgp-yellow px-4 py-2 text-sm font-semibold text-rgp-charcoal"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>

        <div
          ref={contentRef}
          className="space-y-4 rounded-3xl bg-white p-6 shadow-md ring-1 ring-rgp-green/5"
        >
          {entry.messages.map((msg, i) =>
            msg.role === 'user' ? (
              <div
                key={`${msg.role}-${i}`}
                className="rounded-2xl bg-rgp-green px-5 py-3 text-sm text-white"
              >
                <p className="mb-1 text-xs font-semibold uppercase opacity-70">Kamu</p>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ) : (
              <article
                key={`${msg.role}-${i}`}
                className="rounded-2xl border border-rgp-green/10 bg-white px-6 py-6"
              >
                <p className="mb-4 text-xs font-semibold uppercase text-rgp-muted">RGP</p>
                <MessageProse content={msg.content} />
              </article>
            )
          )}
        </div>

        <Link
          href={`/${userId}`}
          className="mt-6 inline-block text-sm text-rgp-green hover:underline"
        >
          ← Kembali ke dashboard
        </Link>
      </main>
    </div>
  );
}
