'use client';

import { useState } from 'react';
import {
  marriagePhases,
  marriageSources,
  type MarriagePhase,
  type WarningType,
} from '@/lib/data/marriage-phases';

const warningStyles: Record<
  WarningType,
  { bg: string; border: string; text: string }
> = {
  danger: { bg: '#FCEBEB', border: '#E24B4A', text: '#A32D2D' },
  amber: { bg: '#FAEEDA', border: '#BA7517', text: '#854F0B' },
  info: { bg: '#E6F1FB', border: '#378ADD', text: '#185FA5' },
  success: { bg: '#EAF3DE', border: '#639922', text: '#3B6D11' },
};

function PhaseContent({ phase }: { phase: MarriagePhase }) {
  const wc = warningStyles[phase.warning.type];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 border-b border-rgp-green/10 pb-5">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl"
          style={{ background: phase.bg, color: phase.color }}
        >
          {phase.icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-rgp-charcoal">{phase.name}</h2>
          <p className="mt-1 text-xs text-rgp-muted">{phase.duration}</p>
          <p className="mt-2 text-sm leading-relaxed text-rgp-muted">{phase.tagline}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-rgp-muted">
          Matriks Fase
        </h3>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {phase.metrics.map((m) => (
            <div key={m.label} className="rounded-lg bg-white p-3 ring-1 ring-rgp-green/5">
              <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: phase.color }}>
                {m.label}
              </p>
              <p className="mt-1 text-sm leading-snug text-rgp-charcoal">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-rgp-muted">
          Sternberg Triangle — Level
        </h3>
        <div className="rounded-lg bg-white p-4 ring-1 ring-rgp-green/5">
          {phase.progress.map((pr) => (
            <div key={pr.label} className="mb-2 flex items-center gap-2.5 last:mb-0">
              <span className="w-20 shrink-0 text-xs text-rgp-muted">{pr.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-rgp-green/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pr.val}%`, background: pr.color }}
                />
              </div>
              <span className="w-8 text-right text-xs font-medium" style={{ color: pr.color }}>
                {pr.val}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-rgp-muted">
          Yang Perlu Dipelajari di Fase Ini
        </h3>
        <ul className="space-y-2">
          {phase.learn.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-rgp-charcoal">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: phase.color }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-3 ring-1 ring-rgp-green/5">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[#3B6D11]">
            Yang perlu dilakukan
          </p>
          <ul className="space-y-2">
            {phase.green.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-rgp-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-[#639922] bg-[#EAF3DE]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-white p-3 ring-1 ring-rgp-green/5">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[#A32D2D]">
            Trap yang harus dihindari
          </p>
          <ul className="space-y-2">
            {phase.red.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-rgp-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-[#E24B4A] bg-[#FCEBEB]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="rounded-lg border-l-[3px] px-4 py-3 text-sm leading-relaxed"
        style={{ background: wc.bg, borderLeftColor: wc.border, color: wc.text }}
      >
        {phase.warning.text}
      </div>
    </div>
  );
}

export default function MarriageCycleViewer() {
  const [current, setCurrent] = useState(0);
  const phase = marriagePhases[current];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {marriagePhases.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setCurrent(i)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
              i === current
                ? 'border-transparent font-medium text-white'
                : 'border-rgp-green/20 text-rgp-muted hover:bg-white'
            }`}
            style={i === current ? { background: p.color } : undefined}
          >
            {i + 1}. {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-1">
        {marriagePhases.map((p, i) => (
          <div key={p.id} className="flex shrink-0 items-center gap-1">
            <div
              className="h-2 w-2 rounded-full border-2 transition-all"
              style={{
                background: i <= current ? p.color : 'transparent',
                borderColor: i <= current ? p.color : 'rgba(7,72,54,0.2)',
              }}
            />
            {i < marriagePhases.length - 1 && (
              <div className="h-px w-6 bg-rgp-green/15" />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-rgp-green/5">
        <PhaseContent phase={phase} />
      </div>

      <p className="mt-8 border-t border-rgp-green/10 pt-6 text-xs leading-relaxed text-rgp-muted">
        {marriageSources}
      </p>
    </div>
  );
}
