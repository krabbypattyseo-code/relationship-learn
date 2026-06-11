import Header from '@/components/Header';
import GrowthDashboard from '@/components/GrowthDashboard';
import { getEntries } from '@/lib/storage';
import type { ChatEntry } from '@/types';

export default async function GrowthPage() {
  const [haristResult, dianResult] = await Promise.all([
    getEntries({ userId: 'harist', limit: 50 }),
    getEntries({ userId: 'dian', limit: 50 }),
  ]);

  const haristEntries: ChatEntry[] =
    'error' in haristResult ? [] : haristResult;
  const dianEntries: ChatEntry[] = 'error' in dianResult ? [] : dianResult;

  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <h1 className="mb-2 text-3xl font-bold text-rgp-green">Shared Growth</h1>
        <p className="mb-10 text-rgp-muted">
          Overview aktivitas journaling Harist dan Dian.
        </p>

        <div className="space-y-16">
          <section>
            <h2 className="mb-6 text-xl font-bold text-rgp-harist">Harist</h2>
            <GrowthDashboard entries={haristEntries} />
          </section>

          <section>
            <h2 className="mb-6 text-xl font-bold text-rgp-dian">Dian</h2>
            <GrowthDashboard entries={dianEntries} />
          </section>
        </div>
      </main>
    </div>
  );
}
