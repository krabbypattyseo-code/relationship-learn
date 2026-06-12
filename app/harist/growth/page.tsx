import Header from '@/components/Header';
import UserNav from '@/components/UserNav';
import GrowthDashboard from '@/components/GrowthDashboard';
import { loadGrowthData } from '@/lib/growth-data';

export default async function HaristGrowthPage() {
  const { entries, snapshot } = await loadGrowthData('harist');

  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <UserNav userId="harist" userLabel="Harist" />
        <h1 className="mb-2 text-3xl font-bold text-rgp-green">Growth</h1>
        <p className="mb-10 text-rgp-muted">
          Hormone Performance & Emotion Regulation — pribadi Harist, termasuk history
          aktivitas.
        </p>
        <GrowthDashboard entries={entries} snapshot={snapshot} userId="harist" variant="private" />
      </main>
    </div>
  );
}
