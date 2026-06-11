import {
  parseMessageBlocks,
  SECTION_STYLES,
  splitComparisonBullet,
  splitGlossaryBullet,
  stripMarkdownBold,
} from '@/lib/render-message';

interface MessageProseProps {
  content: string;
}

function BulletItem({
  bullet,
  kind,
}: {
  bullet: string;
  kind: keyof typeof SECTION_STYLES;
}) {
  const style = SECTION_STYLES[kind];

  if (kind === 'glossary') {
    const entry = splitGlossaryBullet(bullet);
    if (entry) {
      return (
        <li className="flex gap-3 text-[14px] leading-[1.65]">
          <span className="min-w-[120px] shrink-0 font-semibold text-rgp-green">
            {entry.term}
          </span>
          <span className="text-rgp-muted">{entry.def}</span>
        </li>
      );
    }
  }

  if (kind === 'felt-vs-brain') {
    const comparison = splitComparisonBullet(bullet);
    if (comparison) {
      return (
        <li className="rounded-lg bg-white/80 px-3 py-2.5 text-[14px] leading-[1.65]">
          <div className="mb-1">
            <span className="font-semibold text-rgp-charcoal">Dirasakan: </span>
            <span>{comparison.felt}</span>
          </div>
          <div>
            <span className="font-semibold text-rgp-green">Otak: </span>
            <span className="text-rgp-muted">{comparison.brain}</span>
          </div>
        </li>
      );
    }
  }

  return (
    <li className="flex gap-2 text-[14px] leading-[1.65] text-rgp-charcoal">
      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.bullet}`} />
      <span>{stripMarkdownBold(bullet)}</span>
    </li>
  );
}

export default function MessageProse({ content }: MessageProseProps) {
  const blocks = parseMessageBlocks(content);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const kind = block.kind === 'default' && block.title ? 'book' : block.kind;
        const style = SECTION_STYLES[kind];
        const isCard = Boolean(block.title) || kind !== 'default';

        return (
          <div key={i} className={isCard ? style.card : undefined}>
            {block.title && (
              <p className={`mb-2 ${style.title}`}>{block.title}</p>
            )}

            {block.paragraphs.map((paragraph, j) => (
              <p
                key={j}
                className="mb-3 text-[15px] leading-[1.8] text-rgp-charcoal last:mb-0"
              >
                {stripMarkdownBold(paragraph)}
              </p>
            ))}

            {block.bullets.length > 0 && (
              <ul
                className={`mt-2 space-y-2 ${
                  block.paragraphs.length > 0 || block.title
                    ? 'border-t border-rgp-green/8 pt-3'
                    : ''
                } ${kind === 'glossary' ? 'divide-y divide-rgp-cream' : ''}`}
              >
                {block.bullets.map((bullet, j) => (
                  <BulletItem key={j} bullet={bullet} kind={kind} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
