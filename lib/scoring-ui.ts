import type { ERScoreRaw, HormoneScore } from '@/types';

export type ScoreBand = {
  label: string;
  color: string;
  interpretation: string;
};

export function getScoreBand(score: number): ScoreBand {
  if (score >= 85) {
    return {
      label: 'Excellent',
      color: '#7C3AED',
      interpretation: 'Secara konsisten hadir, reflektif, dan regulated',
    };
  }
  if (score >= 70) {
    return {
      label: 'Terkontrol baik',
      color: '#059669',
      interpretation: 'Responsif dan sadar diri, minor blind spots',
    };
  }
  if (score >= 51) {
    return {
      label: 'Berkembang',
      color: '#D97706',
      interpretation: 'Sadar tapi belum konsisten, ada area perlu latihan',
    };
  }
  return {
    label: 'Perlu perhatian',
    color: '#DC2626',
    interpretation: 'Reaktif, kurang refleksi, butuh intervensi aktif',
  };
}

export function getStressLevelLabel(cortisolScore: number): string {
  if (cortisolScore >= 70) return 'Rendah';
  if (cortisolScore >= 40) return 'Sedang';
  return 'Tinggi';
}

export function getHormoneHint(
  hormone: keyof HormoneScore,
  score: number
): string | null {
  if (score >= 40) return null;
  const hints: Record<keyof HormoneScore, string> = {
    oxytocin: 'Kurang quality time — pertimbangkan ritual baru',
    dopamine: 'Konsistensi journaling perlu dijaga',
    serotonin: 'Pola tidak stabil — coba jadwal check-in rutin',
    cortisol: 'Ada tension yang belum resolved — saatnya /analisis atau /conversation',
  };
  return hints[hormone];
}

export function getERDimensionHint(
  dimension: keyof Omit<ERScoreRaw, 'rationale'>
): string {
  const hints = {
    self_awareness:
      'Coba /reflect lebih sering — perhatikan apa yang kamu rasakan, bukan hanya apa yang terjadi',
    self_regulation:
      'Setelah /analisis, selalu follow up dengan /plan — jangan biarkan tension unresolved',
    empathy:
      'Di setiap /reflect, tambahkan satu paragraf tentang bagaimana pasangan mungkin merasakan situasi ini',
    social_skill:
      'Gunakan /conversation sebelum percakapan penting — preparation adalah bentuk respect',
  };
  return hints[dimension];
}

export function formatWeekLabel(periodStart: string): string {
  const d = new Date(`${periodStart}T12:00:00`);
  return d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
}

const ER_CACHE_MS = 86400000;

export function isERCacheFresh(erGeneratedAt: string | null | undefined): boolean {
  if (!erGeneratedAt) return false;
  return Date.now() - new Date(erGeneratedAt).getTime() < ER_CACHE_MS;
}
