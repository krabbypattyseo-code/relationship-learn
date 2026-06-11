'use client';

import { useState } from 'react';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import type { UserId } from '@/types';

interface ChangePinFormProps {
  userId: UserId;
  userLabel: string;
}

export default function ChangePinForm({ userId, userLabel }: ChangePinFormProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPin !== confirmPin) {
      setError('Konfirmasi PIN tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPin, newPin }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Gagal mengganti PIN');
      }

      setSuccess(true);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengganti PIN');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-rgp-green/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-rgp-cream p-2 text-rgp-green">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-rgp-charcoal">Ganti PIN</h2>
            <p className="text-sm text-rgp-muted">
              Ubah PIN login {userLabel}
            </p>
          </div>
        </div>
        <span className="text-sm text-rgp-green">{open ? 'Tutup' : 'Buka'}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-rgp-cream pt-6">
          <div>
            <label htmlFor={`${userId}-current-pin`} className="mb-1 block text-sm font-medium text-rgp-charcoal">
              PIN saat ini
            </label>
            <input
              id={`${userId}-current-pin`}
              type="password"
              inputMode="numeric"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              className="w-full rounded-2xl border border-rgp-green/20 bg-rgp-cream px-4 py-3 text-sm focus:border-rgp-green focus:outline-none focus:ring-2 focus:ring-rgp-green/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${userId}-new-pin`} className="mb-1 block text-sm font-medium text-rgp-charcoal">
                PIN baru
              </label>
              <input
                id={`${userId}-new-pin`}
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="4–8 digit"
                className="w-full rounded-2xl border border-rgp-green/20 bg-rgp-cream px-4 py-3 text-sm focus:border-rgp-green focus:outline-none focus:ring-2 focus:ring-rgp-green/20"
                required
              />
            </div>
            <div>
              <label htmlFor={`${userId}-confirm-pin`} className="mb-1 block text-sm font-medium text-rgp-charcoal">
                Konfirmasi PIN baru
              </label>
              <input
                id={`${userId}-confirm-pin`}
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full rounded-2xl border border-rgp-green/20 bg-rgp-cream px-4 py-3 text-sm focus:border-rgp-green focus:outline-none focus:ring-2 focus:ring-rgp-green/20"
                required
              />
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
          )}

          {success && (
            <p className="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              PIN berhasil diperbarui!
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-rgp-yellow px-6 py-2.5 text-sm font-semibold text-rgp-charcoal transition hover:bg-rgp-yellow-soft disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan PIN Baru'}
          </button>
        </form>
      )}
    </div>
  );
}
