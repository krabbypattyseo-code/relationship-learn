import Header from '@/components/Header';
import UserNav from '@/components/UserNav';
import GrowthDashboard from '@/components/GrowthDashboard';
import ChangePinForm from '@/components/ChangePinForm';
import BookLibrary from '@/components/BookLibrary';
import { getEntries } from '@/lib/storage';
import type { ChatEntry } from '@/types';

export default async function HaristDashboardPage() {
  const result = await getEntries({ userId: 'harist', limit: 50 });
  const entries: ChatEntry[] = 'error' in result ? [] : result;

  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <UserNav userId="harist" userLabel="Harist" />
        <h1 className="mb-8 text-3xl font-bold text-rgp-green">Dashboard</h1>

        <div className="mb-8">
          <ChangePinForm userId="harist" userLabel="Harist" />
        </div>

        <div className="mb-8">
          <BookLibrary />
        </div>

        <GrowthDashboard entries={entries} />
      </main>
    </div>
  );
}
