import Link from 'next/link';
import type { UserId } from '@/types';

interface UserNavProps {
  userId: UserId;
  userLabel: string;
}

export default function UserNav({ userId, userLabel }: UserNavProps) {
  const links = [
    { href: `/${userId}`, label: 'Dashboard' },
    { href: `/${userId}/chat`, label: 'Chat' },
    { href: `/${userId}/growth`, label: 'Growth' },
  ];

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm font-semibold text-rgp-green">{userLabel}</span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-rgp-green/20 px-4 py-2 text-sm font-medium text-rgp-green transition hover:border-rgp-yellow hover:bg-rgp-yellow/10"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
