import type { RefObject } from 'react';

export async function exportToPDF(
  ref: RefObject<HTMLDivElement | null>,
  filename: string
): Promise<void> {
  if (!ref.current) {
    return;
  }

  const html2pdf = (await import('html2pdf.js')).default;
  const opt = {
    margin: [12, 14, 12, 14] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
  };

  await html2pdf().set(opt).from(ref.current).save();
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function getPreviewText(messages: { role: string; content: string }[]): string {
  const last = [...messages].reverse().find((m) => m.content.trim());
  return last?.content.slice(0, 120) ?? 'No content';
}
