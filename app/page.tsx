import Link from 'next/link';
import Header from '@/components/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-rgp-green text-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rgp-yellow/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-rgp-yellow/20 blur-2xl" />
        <div className="dot-pattern absolute inset-0 opacity-30" />

        <Header variant="hero" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-8 lg:grid-cols-2 lg:items-center lg:px-12 lg:pb-32">
          <div>
            <p className="mb-4 inline-block rounded-full bg-rgp-yellow/20 px-4 py-1 text-sm font-medium text-rgp-yellow">
              Private · AI-Powered
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Relationship Growth Partner
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/80">
              Journaling dan growth tool pribadi untuk Harist dan Dian. Reflect,
              analisis, plan, dan grow — dengan Claude sebagai partner.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/harist/login"
                className="rounded-full bg-rgp-yellow px-8 py-3 font-semibold text-rgp-charcoal transition hover:bg-rgp-yellow-soft"
              >
                Masuk sebagai Harist
              </Link>
              <Link
                href="/dian/login"
                className="rounded-full border-2 border-white/40 px-8 py-3 font-semibold text-white transition hover:border-rgp-yellow hover:text-rgp-yellow"
              >
                Masuk sebagai Dian
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-rgp-yellow" />
            <div className="relative overflow-hidden rounded-3xl border-4 border-rgp-yellow/50 bg-white/10 p-8 backdrop-blur-sm">
              <div className="space-y-4">
                {['/reflect', '/analisis', '/plan', '/conversation', '/growth'].map(
                  (mode) => (
                    <div
                      key={mode}
                      className="flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-3"
                    >
                      <div className="h-3 w-3 rounded-full bg-rgp-yellow" />
                      <span className="font-medium">{mode}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-rgp-cream py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <h2 className="mb-12 text-center text-3xl font-bold text-rgp-charcoal">
            Why Choose RGP
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Reflect',
                desc: 'Journaling momen dengan neuro layer dan love language lens.',
              },
              {
                title: 'Analyse',
                desc: 'Bedah situasi dengan perspektif balanced untuk keduanya.',
              },
              {
                title: 'Plan',
                desc: 'Rancang langkah 7 hari dan 30 hari yang actionable.',
              },
              {
                title: 'Grow',
                desc: 'Review berkala dengan streak tracking dan insights.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-rgp-green/5"
              >
                <div className="mb-4 h-12 w-12 rounded-2xl bg-rgp-green/10" />
                <h3 className="text-lg font-bold text-rgp-green">{item.title}</h3>
                <p className="mt-2 text-sm text-rgp-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-rgp-green py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
          <p className="text-lg font-semibold">Relationship Growth Partner</p>
          <p className="mt-2 text-sm text-white/70">Harist × Dian · June 2026</p>
        </div>
      </footer>
    </div>
  );
}
