import Link from 'next/link';
import Header from '@/components/Header';
import QuestionsWorksheet from '@/components/QuestionsWorksheet';
import { totalQuestions } from '@/lib/data/perlu-diobrolin-questions';

export default function PertanyaanPage() {
  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-10 lg:px-12">
        <Link
          href="/perlu-diobrolin"
          className="mb-6 inline-block text-sm text-rgp-muted hover:text-rgp-green"
        >
          ← Perlu Diobrolin
        </Link>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-rgp-muted">
          Worksheet · {totalQuestions} pertanyaan
        </p>
        <h1 className="mb-3 text-3xl font-bold text-rgp-green">Pertanyaan Pre-Marriage</h1>
        <p className="mb-8 text-sm text-rgp-muted">
          Isi POV masing-masing, tandai status obrolan. Data tersimpan di browser kamu
          (localStorage).
        </p>
        <QuestionsWorksheet />
      </main>
    </div>
  );
}
