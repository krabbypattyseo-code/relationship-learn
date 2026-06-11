import Link from 'next/link';
import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';

export default function HaristLoginPage() {
  return (
    <div className="min-h-screen bg-rgp-green">
      <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-rgp-yellow/20 blur-3xl" />
      <Header variant="hero" />
      <div className="relative mx-auto flex max-w-md flex-col items-center px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-white">Harist&apos;s Space</h1>
        <p className="mb-8 text-center text-white/70">
          Masuk dengan PIN untuk akses dashboard dan chat.
        </p>
        <LoginForm userId="harist" userLabel="Harist" />
        <Link href="/" className="mt-8 text-sm text-white/60 hover:text-rgp-yellow">
          ← Kembali ke home
        </Link>
      </div>
    </div>
  );
}
