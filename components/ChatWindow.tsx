'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Download, Send, Loader2 } from 'lucide-react';
import type {
  ChatWindowProps,
  Message,
  ModeHistoricalResponse,
  ModeScoreData,
} from '@/types';
import { exportToPDF } from '@/lib/utils';
import MessageProse from '@/components/MessageProse';
import ModeScoreHeader from '@/components/ModeScoreHeader';
import SessionScoreCard from '@/components/SessionScoreCard';
import { parseScoreFromResponse } from '@/lib/score-parse';
import { calcSessionScore } from '@/lib/mode-scoring';

export default function ChatWindow({
  userId,
  mode,
  initialMessages = [],
  onSave,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [historicalData, setHistoricalData] = useState<ModeHistoricalResponse | null>(
    null
  );
  const [historicalLoading, setHistoricalLoading] = useState(true);
  const [pendingMessages, setPendingMessages] = useState<Message[] | null>(null);
  const [sessionScore, setSessionScore] = useState<ModeScoreData | null>(null);
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sessionScore, scrollToBottom]);

  useEffect(() => {
    if (mode === 'growth') {
      setHistoricalLoading(false);
      return;
    }

    setHistoricalLoading(true);
    fetch(`/api/scores/mode?userId=${userId}&mode=${mode}&limit=5`)
      .then((r) => r.json())
      .then((data: ModeHistoricalResponse) => setHistoricalData(data))
      .catch(() => setHistoricalData(null))
      .finally(() => setHistoricalLoading(false));
  }, [userId, mode]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isStreaming || pendingMessages) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setSessionScore(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, mode, messages: nextMessages }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error ?? 'Request failed');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantContent,
          };
          return updated;
        });
      }

      const { cleanText, scoreData } = parseScoreFromResponse(assistantContent);
      const finalMessages: Message[] = [
        ...nextMessages,
        { role: 'assistant', content: cleanText },
      ];

      setMessages(finalMessages);

      const computed = calcSessionScore(
        mode,
        scoreData,
        historicalData?.historicalAvg ?? null
      );
      setSessionScore(computed);
      setPendingMessages(finalMessages);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== '' || m.role !== 'assistant'),
        { role: 'assistant', content: `Error: ${message}` },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  async function handleSaveSession() {
    if (!pendingMessages || !onSave) return;
    setSaving(true);
    try {
      await onSave(pendingMessages, sessionScore);
      setPendingMessages(null);
      setSessionScore(null);
      setMessages([]);
      if (mode !== 'growth') {
        const res = await fetch(
          `/api/scores/mode?userId=${userId}&mode=${mode}&limit=5`
        );
        if (res.ok) setHistoricalData(await res.json());
      }
    } finally {
      setSaving(false);
    }
  }

  function handleDiscardSession() {
    if (pendingMessages) {
      setMessages(pendingMessages.slice(0, -2));
    }
    setPendingMessages(null);
    setSessionScore(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const inputDisabled = isLoading || isStreaming || !!pendingMessages || saving;

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white shadow-lg ring-1 ring-rgp-green/10">
      <div className="flex items-center justify-between border-b border-rgp-cream px-6 py-4">
        <div>
          <p className="text-sm font-medium text-rgp-muted">Mode</p>
          <p className="text-lg font-semibold text-rgp-green">/{mode}</p>
        </div>
        <button
          type="button"
          onClick={() => exportToPDF(contentRef, `rgp-${mode}-${Date.now()}.pdf`)}
          className="inline-flex items-center gap-2 rounded-full bg-rgp-yellow px-4 py-2 text-sm font-semibold text-rgp-charcoal transition hover:bg-rgp-yellow-soft"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      <ModeScoreHeader mode={mode} data={historicalData} loading={historicalLoading} />

      <div ref={contentRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.length === 0 && !pendingMessages && (
          <div className="flex h-full min-h-[200px] items-center justify-center text-center text-rgp-muted">
            <p>Mulai dengan mengetik momen atau pertanyaanmu...</p>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <div key={`${msg.role}-${i}`} className="flex justify-end">
              <div className="max-w-[75%] rounded-2xl bg-rgp-green px-5 py-3 text-sm leading-relaxed text-white">
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ) : (
            <article
              key={`${msg.role}-${i}`}
              className="rounded-2xl border border-rgp-green/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-7"
            >
              <MessageProse content={msg.content} />
            </article>
          )
        )}

        {(isLoading || isStreaming) && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-rgp-cream px-4 py-3 text-sm text-rgp-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Mengetik...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {pendingMessages && (
        sessionScore ? (
          <SessionScoreCard
            userId={userId}
            mode={mode}
            sessionScore={sessionScore}
            historicalScore={historicalData?.historicalAvg ?? null}
            saving={saving}
            onSave={handleSaveSession}
            onDiscard={handleDiscardSession}
          />
        ) : (
          <div className="mx-4 mb-4 rounded-2xl border border-rgp-green/20 bg-rgp-cream px-4 py-3">
            <p className="mb-3 text-sm text-rgp-muted">
              Sesi selesai. Score tidak terdeteksi — tetap bisa disimpan.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveSession}
                disabled={saving}
                className="rounded-full bg-rgp-green px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan sesi ini'}
              </button>
              <button
                type="button"
                onClick={handleDiscardSession}
                disabled={saving}
                className="rounded-full border border-rgp-green/30 px-5 py-2 text-sm text-rgp-muted"
              >
                Buang
              </button>
            </div>
          </div>
        )
      )}

      <div className="border-t border-rgp-cream p-4">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              pendingMessages
                ? 'Simpan atau buang sesi dulu...'
                : 'Ketik pesan... (Enter untuk kirim)'
            }
            rows={2}
            disabled={inputDisabled}
            className="flex-1 resize-none rounded-2xl border border-rgp-green/20 bg-rgp-cream px-4 py-3 text-sm text-rgp-charcoal placeholder:text-rgp-muted focus:border-rgp-green focus:outline-none focus:ring-2 focus:ring-rgp-green/20 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || inputDisabled}
            className="inline-flex h-auto items-center justify-center rounded-2xl bg-rgp-yellow px-5 text-rgp-charcoal transition hover:bg-rgp-yellow-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
