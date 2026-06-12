import type { Mode } from '@/types';

export function parseScoreFromResponse(rawText: string): {
  cleanText: string;
  scoreData: Record<string, number | string | string[]> | null;
} {
  const trimmed = rawText.trim();
  const scoreLineMatch = trimmed.match(/\nSCORE_JSON:(\{[\s\S]*\})\s*$/);

  if (scoreLineMatch) {
    try {
      const scoreData = JSON.parse(scoreLineMatch[1]) as Record<
        string,
        number | string | string[]
      >;
      const cleanText = trimmed.slice(0, scoreLineMatch.index).trim();
      return { cleanText, scoreData };
    } catch {
      return { cleanText: rawText, scoreData: null };
    }
  }

  const lines = rawText.split('\n');
  const lastLine = lines[lines.length - 1]?.trim() ?? '';
  if (!lastLine.startsWith('SCORE_JSON:')) {
    return { cleanText: rawText, scoreData: null };
  }

  try {
    const jsonStr = lastLine.replace('SCORE_JSON:', '').trim();
    const scoreData = JSON.parse(jsonStr) as Record<
      string,
      number | string | string[]
    >;
    const cleanText = lines.slice(0, -1).join('\n').trim();
    return { cleanText, scoreData };
  } catch {
    return { cleanText: rawText, scoreData: null };
  }
}

export const SCORE_JSON_PROMPTS: Record<Mode, string> = {
  reflect: `
Setelah responmu selesai, tambahkan SATU baris terakhir (tanpa teks lain setelahnya):
SCORE_JSON:{"oxytocin_delta":<-20 to +20>,"serotonin_delta":<-20 to +20>,"signals":["signal1","signal2"]}
Sinyal +oxytocin: empatik ke pasangan, ritual, quality time. +serotonin: emotional granularity, insight, resolusi. Negatif: rumination, no insight.`,

  analisis: `
Setelah responmu selesai, tambahkan SATU baris terakhir:
SCORE_JSON:{"self_regulation_delta":<-20 to +20>,"cortisol_delta":<-20 to +20>,"signals":["signal1"]}
+self_reg: objektif, perspektif pasangan, opsi konkret. -self_reg: blame, catastrophizing. +cortisol_delta = tension tinggi terdeteksi.`,

  plan: `
Setelah responmu selesai, tambahkan SATU baris terakhir:
SCORE_JSON:{"dopamine_delta":<-20 to +20>,"social_skill_delta":<-20 to +20>,"signals":["signal1"]}
+dopamine: timeline konkret, contingency. +social_skill: consideration pasangan, love language. Negatif: abstrak, tidak consider pasangan.`,

  conversation: `
Setelah responmu selesai, tambahkan SATU baris terakhir:
SCORE_JSON:{"oxytocin_delta":<-20 to +20>,"self_regulation_delta":<-20 to +20>,"empathy_delta":<-20 to +20>,"signals":["signal1"]}
+self_reg: soft startup, I-statement. +empathy: consideration respon pasangan. +oxytocin: closing affirming. Negatif: accusatory, no warmth.`,

  growth: `
Setelah responmu selesai, tambahkan SATU baris terakhir:
SCORE_JSON:{"self_awareness":<0-100>,"self_regulation":<0-100>,"empathy":<0-100>,"social_skill":<0-100>,"narrative":"<1 kalimat insight>","focus_next":"<1 hal konkret>"}`,
};
