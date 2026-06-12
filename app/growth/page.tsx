import Header from '@/components/Header';
import GrowthDashboard from '@/components/GrowthDashboard';
import { loadGrowthData } from '@/lib/growth-data';

export default async function GrowthPage() {
  const [harist, dian] = await Promise.all([
    loadGrowthData('harist'),
    loadGrowthData('dian'),
  ]);

  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <h1 className="mb-2 text-3xl font-bold text-rgp-green">Shared Growth</h1>
        <p className="mb-10 max-w-2xl text-rgp-muted">
          Hormone Performance & Emotion Regulation scores — ringkasan angka performa
          Harist dan Dian tanpa detail aktivitas pribadi.
        </p>

        <div className="space-y-16">
          <section>
            <h2 className="mb-6 text-xl font-bold text-rgp-harist">Harist</h2>
            <GrowthDashboard
              entries={harist.entries}
              snapshot={harist.snapshot}
              variant="shared"
            />
          </section>

          <section>
            <h2 className="mb-6 text-xl font-bold text-rgp-dian">Dian</h2>
            <GrowthDashboard
              entries={dian.entries}
              snapshot={dian.snapshot}
              variant="shared"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
