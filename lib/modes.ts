import type { ModeConfig } from '@/types';

export const MODES: ModeConfig[] = [
  {
    id: 'reflect',
    label: '/reflect',
    icon: 'mirror',
    description: 'Journaling momen',
  },
  {
    id: 'analisis',
    label: '/analisis',
    icon: 'search',
    description: 'Bedah situasi',
  },
  {
    id: 'plan',
    label: '/plan',
    icon: 'compass',
    description: 'Rancang ke depan',
  },
  {
    id: 'conversation',
    label: '/conversation',
    icon: 'message',
    description: 'Siapkan percakapan',
  },
  {
    id: 'growth',
    label: '/growth',
    icon: 'trending',
    description: 'Review berkala',
  },
];

export const MODE_COLORS: Record<string, string> = {
  reflect: 'bg-purple-100 text-purple-800',
  analisis: 'bg-blue-100 text-blue-800',
  plan: 'bg-amber-100 text-amber-800',
  conversation: 'bg-green-100 text-green-800',
  growth: 'bg-rgp-yellow/30 text-rgp-green-dark',
};

export const USER_ACCENTS: Record<'harist' | 'dian', { border: string; bg: string; text: string }> = {
  harist: {
    border: 'border-rgp-harist',
    bg: 'bg-rgp-harist',
    text: 'text-rgp-harist',
  },
  dian: {
    border: 'border-rgp-dian',
    bg: 'bg-rgp-dian',
    text: 'text-rgp-dian',
  },
};
