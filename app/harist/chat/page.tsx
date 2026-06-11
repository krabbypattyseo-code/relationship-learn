'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import Header from '@/components/Header';
import UserNav from '@/components/UserNav';
import ChatWindow from '@/components/ChatWindow';
import ModeSelector from '@/components/ModeSelector';
import type { Message, Mode } from '@/types';

const VALID_MODES: Mode[] = [
  'reflect',
  'analisis',
  'plan',
  'conversation',
  'growth',
];

function HaristChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode') as Mode | null;
  const [selectedMode, setSelectedMode] = useState<Mode | null>(
    modeParam && VALID_MODES.includes(modeParam) ? modeParam : null
  );

  const handleSelect = (mode: Mode) => {
    setSelectedMode(mode);
    router.replace(`/harist/chat?mode=${mode}`);
  };

  const handleSave = useCallback(async (messages: Message[]) => {
    if (!selectedMode) return;

    await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'harist',
        mode: selectedMode,
        messages,
      }),
    });
  }, [selectedMode]);

  return (
    <div className="min-h-screen bg-rgp-cream">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-12">
        <UserNav userId="harist" userLabel="Harist" />

        {!selectedMode ? (
          <>
            <h1 className="mb-2 text-3xl font-bold text-rgp-green">Pilih Mode</h1>
            <p className="mb-8 text-rgp-muted">Pilih mode sebelum mulai chat.</p>
            <ModeSelector userId="harist" onSelect={handleSelect} />
          </>
        ) : (
          <div className="h-[calc(100vh-220px)] min-h-[500px]">
            <ChatWindow
              userId="harist"
              mode={selectedMode}
              onSave={handleSave}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function HaristChatPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <HaristChatContent />
    </Suspense>
  );
}
