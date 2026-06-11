import Link from 'next/link';
import { Heart, User, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  variant?: 'hero' | 'light';
}

export default function Header({ variant = 'light' }: HeaderProps) {
  const isHero = variant === 'hero';

  return (
    <header
      className={`relative z-10 px-6 py-5 lg:px-12 ${
        isHero ? 'text-white' : 'bg-rgp-cream text-rgp-charcoal'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rgp-yellow">
            <Heart className="h-5 w-5 text-rgp-green" />
          </div>
          <span className="text-lg font-bold">RGP</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium opacity-90 hover:opacity-100">
            Home
          </Link>
          <Link href="/harist" className="text-sm font-medium opacity-90 hover:opacity-100">
            Harist
          </Link>
          <Link href="/dian" className="text-sm font-medium opacity-90 hover:opacity-100">
            Dian
          </Link>
          <Link href="/growth" className="text-sm font-medium opacity-90 hover:opacity-100">
            Growth
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Profile"
            className={`rounded-full p-2 ${isHero ? 'hover:bg-white/10' : 'hover:bg-rgp-green/5'}`}
          >
            <User className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Cart"
            className={`rounded-full p-2 ${isHero ? 'hover:bg-white/10' : 'hover:bg-rgp-green/5'}`}
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
