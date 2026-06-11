import Link from 'next/link';
import Header from '@/components/Header';
import { MessageCircle, HeartHandshake } from 'lucide-react';

export default function PerluDiobrolinPage() {
  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-12">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-rgp-muted">
          RGP · Pre-Marriage Toolkit
        </p>
        <h1 className="mb-3 text-3xl font-bold text-rgp-green">Perlu Diobrolin</h1>
        <p className="mb-10 max-w-2xl text-rgp-muted">
          Worksheet pertanyaan pre-marriage dan referensi Marriage Cycle — alat obrolan
          terstruktur untuk Harist & Dian sebelum dan selama perjalanan hubungan.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/perlu-diobrolin/pertanyaan"
            className="group rounded-3xl bg-white p-8 shadow-md ring-1 ring-rgp-green/5 transition hover:ring-rgp-green/20"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rgp-yellow/30">
              <MessageCircle className="h-6 w-6 text-rgp-green" />
            </div>
            <h2 className="text-xl font-bold text-rgp-charcoal group-hover:text-rgp-green">
              Worksheet Pertanyaan
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-rgp-muted">
              81 pertanyaan dalam 9 kategori — Self, Karier, Relasi, Pernikahan,
              Konflik, Keluarga, Finansial, Love Language, dan Gap.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-rgp-green">
              Buka worksheet →
            </span>
          </Link>

          <Link
            href="/perlu-diobrolin/marriage"
            className="group rounded-3xl bg-white p-8 shadow-md ring-1 ring-rgp-green/5 transition hover:ring-rgp-green/20"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rgp-green/10">
              <HeartHandshake className="h-6 w-6 text-rgp-green" />
            </div>
            <h2 className="text-xl font-bold text-rgp-charcoal group-hover:text-rgp-green">
              Marriage Cycle
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-rgp-muted">
              5 fase pernikahan dengan matriks neurosains, Sternberg Triangle, dan
              framework actionable di setiap tahap.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-rgp-green">
              Lihat fase →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
