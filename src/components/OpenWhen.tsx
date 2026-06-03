import { useState } from 'react';
import content from '../config/content';
import type { OpenWhenNote } from '../config/content';
import { fill } from '../lib/text';
import { cn } from '../lib/cn';
import { useReducedMotion } from '../lib/useReducedMotion';
import { Reveal } from './Reveal';
import { Lantern } from './Lantern';

function NoteLantern({ note, index }: { note: OpenWhenNote; index: number }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const id = `open-when-msg-${index}`;

  return (
    <div
      className={cn(
        'group h-full rounded-2xl border p-5 transition duration-300',
        open
          ? 'border-ember-400/40 bg-night-800/60 shadow-glow'
          : 'border-night-600/50 bg-night-800/25 hover:border-ember-400/25 hover:bg-night-800/40',
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-3">
          <Lantern
            className={cn('w-7 shrink-0 transition', open ? '' : 'opacity-40 saturate-50')}
            glow={open && !reduced}
            flame={open}
          />
          <span
            className={cn(
              'font-display text-lg leading-snug transition-colors',
              open ? 'text-ember-100' : 'text-paper/85',
            )}
          >
            {fill(note.label, content)}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'font-mono text-lg leading-none transition-transform duration-300',
            open ? 'rotate-45 text-ember-300' : 'text-haze/50',
          )}
        >
          +
        </span>
      </button>

      <div
        id={id}
        aria-hidden={!open}
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pt-3 font-body text-sm leading-relaxed text-haze">
            {fill(note.message, content)}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * "Open when…" — a wall of unlit lanterns. Tap one and it lights, revealing its
 * note. Built as accessible disclosure buttons (aria-expanded + controls).
 */
export function OpenWhen() {
  return (
    <section id="open-when" className="relative px-6 py-24 sm:py-28" aria-labelledby="open-when-title">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 text-center sm:mb-16">
          <h2
            id="open-when-title"
            className="font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl"
          >
            {fill(content.openWhen.title, content)}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty font-body text-haze">
            {fill(content.openWhen.intro, content)}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.openWhen.notes.map((note, i) => (
            <Reveal key={i} delay={(i % 3) * 80} className="h-full">
              <NoteLantern note={note} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OpenWhen;
