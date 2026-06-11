'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import type { UserId } from '@/types';

interface LoginFormProps {
  userId: UserId;
  userLabel: string;
}

export default function LoginForm({ userId, userLabel }: LoginFormProps) {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Login gagal');
      }

      router.push(`/${userId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="pin" className="mb-2 block text-sm font-medium text-white/90">
          PIN {userLabel}
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rgp-muted" />
          <input
            id="pin"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Masukkan PIN"
            className="w-full rounded-full border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-white placeholder:text-white/50 focus:border-rgp-yellow focus:outline-none focus:ring-2 focus:ring-rgp-yellow/30"
            required
          />
        </div>
      </div>

      {error && (
        <p className="rounded-2xl bg-red-500/20 px-4 py-2 text-sm text-red-100">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !pin}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-rgp-yellow py-3 font-semibold text-rgp-charcoal transition hover:bg-rgp-yellow-soft disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Masuk'}
      </button>
    </form>
  );
}
