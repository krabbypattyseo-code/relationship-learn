import Header from '@/components/Header';
import UserNav from '@/components/UserNav';
import ChangePinForm from '@/components/ChangePinForm';
import BookLibrary from '@/components/BookLibrary';

export default async function DianDashboardPage() {
  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <UserNav userId="dian" userLabel="Dian" />
        <h1 className="mb-8 text-3xl font-bold text-rgp-green">Dashboard</h1>

        <div className="mb-8">
          <ChangePinForm userId="dian" userLabel="Dian" />
        </div>

        <BookLibrary />
      </main>
    </div>
  );
}
