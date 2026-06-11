export function stripMarkdownBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}

export function isBookTitleLine(line: string): boolean {
  return /^\*\*.+\*\*$/.test(line.trim());
}

export type SectionKind =
  | 'default'
  | 'book'
  | 'felt-vs-brain'
  | 'conflict'
  | 'tips'
  | 'glossary'
  | 'lesson-learn';

export interface ParsedBlock {
  title: string | null;
  kind: SectionKind;
  paragraphs: string[];
  bullets: string[];
}

function classifySection(title: string | null): SectionKind {
  if (!title) return 'default';
  const t = title.toLowerCase();
  if (t.includes('dirasakan') && t.includes('otak')) return 'felt-vs-brain';
  if (t.includes('pencegahan konflik')) return 'conflict';
  if (t.includes('tips menjaga')) return 'tips';
  if (t.includes('glosarium')) return 'glossary';
  if (t.includes('lesson learn')) return 'lesson-learn';
  return 'book';
}

export function parseMessageBlocks(content: string): ParsedBlock[] {
  return content
    .split(/\n\n+/)
    .filter(Boolean)
    .filter((block) => block.trim() !== '---')
    .map((block) => {
      const cleaned = block.replace(/^---\s*$/gm, '').trim();
      const lines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean);
      const bullets = lines
        .filter((l) => /^[•\-–]\s/.test(l))
        .map((l) => l.replace(/^[•\-–]\s*/, '').trim());
      const textLines = lines.filter((l) => !/^[•\-–]\s/.test(l));

      const title = textLines[0] && isBookTitleLine(textLines[0])
        ? stripMarkdownBold(textLines[0])
        : null;
      const paragraphs = title ? textLines.slice(1) : textLines;

      return {
        title,
        kind: classifySection(title),
        paragraphs,
        bullets,
      };
    });
}

export const SECTION_STYLES: Record<
  SectionKind,
  { card: string; title: string; bullet: string }
> = {
  default: {
    card: '',
    title: 'text-rgp-charcoal font-semibold',
    bullet: 'bg-rgp-yellow',
  },
  book: {
    card: 'rounded-xl border border-rgp-green/8 bg-rgp-cream/30 px-5 py-4',
    title: 'text-sm font-bold tracking-wide text-rgp-green',
    bullet: 'bg-rgp-yellow',
  },
  'felt-vs-brain': {
    card: 'rounded-xl border-l-4 border-rgp-yellow bg-rgp-yellow/5 px-5 py-4',
    title: 'text-sm font-bold text-rgp-green-dark',
    bullet: 'bg-rgp-green',
  },
  conflict: {
    card: 'rounded-xl border-l-4 border-rgp-green bg-rgp-green/5 px-5 py-4',
    title: 'text-sm font-bold text-rgp-green',
    bullet: 'bg-rgp-green',
  },
  tips: {
    card: 'rounded-xl border-l-4 border-rgp-dian bg-teal-50 px-5 py-4',
    title: 'text-sm font-bold text-rgp-dian',
    bullet: 'bg-rgp-dian',
  },
  glossary: {
    card: 'rounded-xl border border-rgp-green/10 bg-white px-5 py-4',
    title: 'text-sm font-bold uppercase tracking-wider text-rgp-muted',
    bullet: 'bg-rgp-muted',
  },
  'lesson-learn': {
    card: 'rounded-xl border-2 border-rgp-yellow/40 bg-gradient-to-br from-rgp-yellow/10 to-rgp-cream px-5 py-4',
    title: 'text-sm font-bold text-rgp-green-dark',
    bullet: 'bg-rgp-yellow',
  },
};

export function renderBulletText(bullet: string, kind: SectionKind): string {
  if (kind === 'glossary') {
    return bullet;
  }
  return bullet;
}

export function splitGlossaryBullet(bullet: string): { term: string; def: string } | null {
  const match = bullet.match(/^\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
  if (match) return { term: match[1], def: match[2] };
  const plain = bullet.match(/^(.+?)\s*[—–-]\s*(.+)$/);
  if (plain) return { term: plain[1], def: plain[2] };
  return null;
}

export function isComparisonBullet(bullet: string): boolean {
  return /dirasakan:/i.test(bullet) && /→/.test(bullet);
}

export function splitComparisonBullet(bullet: string): { felt: string; brain: string } | null {
  const match = bullet.match(/dirasakan:\s*(.+?)\s*→\s*otak:\s*(.+)/i);
  if (!match) return null;
  return { felt: match[1].trim(), brain: match[2].trim() };
}
