import { useState } from 'react';
import content from '../config/content';
import type { Memory } from '../config/content';
import { fill, isPlaceholder } from '../lib/text';
import { cn } from '../lib/cn';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useMarquee } from '../lib/useMarquee';
import { Reveal } from './Reveal';
import { Lightbox } from './Lightbox';

// A gentle, repeating tilt so the prints look hand-clipped, not gridded.
const TILTS = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-2', 'rotate-1'];
// Drift speed per row in px/sec — calm, with a little variety between strings.
// Hover eases each row down to a tiny fraction of this (see SLOW_FACTOR).
const SPEEDS = [30, 26, 34];
// While hovered, run at 5% speed — a drastic, near-stop crawl so you can read
// (and easily click) a photo without it sliding away.
const SLOW_FACTOR = 0.05;
// Photos per repeated half. The half is repeated until it comfortably exceeds
// the container so the two-halves -100%/0 loop never gaps.
const MIN_PER_HALF = 10;
const ROWS = 3;

/**
 * Wall prints are tiny (~100px wide), so load the small /photos/thumb-NN.jpg
 * sibling instead of the full /photos/photo-NN.jpg — ≈1 MB of thumbnails across
 * the whole wall instead of ≈12 MB of full images, which is the single biggest
 * data win on a phone. The full image is still used in the full-screen Lightbox.
 * A custom photo path (anything not named photo-NN.jpg) is returned unchanged.
 */
function wallThumb(src: string): string {
  return src.replace(/\/photo-(\d+)\.jpg$/i, '/thumb-$1.jpg');
}

/** Split the photos into a fixed number of rows (top / middle / bottom). */
function intoRows<T>(arr: T[], rowCount: number): T[][] {
  const size = Math.max(1, Math.ceil(arr.length / rowCount));
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

/** The soft warm line the clips ride along. */
function Wire() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-2 z-0 h-px bg-gradient-to-r from-transparent via-ember-400/55 to-transparent shadow-[0_0_10px_rgba(247,171,77,0.4)]"
      aria-hidden="true"
    />
  );
}

/** One small polaroid hung from a glowing LED clip. Click to open full-screen. */
function Photo({ memory, index, onOpen }: { memory: Memory; index: number; onOpen: (m: Memory) => void }) {
  const hasPhoto = memory.src.trim() !== '';
  const titleReal = memory.title.trim() !== '' && !isPlaceholder(memory.title);
  const whenReal = memory.when.trim() !== '' && !isPlaceholder(memory.when);
  const showCaption = titleReal || whenReal;

  return (
    <button
      type="button"
      onClick={() => hasPhoto && onOpen(memory)}
      aria-label={isPlaceholder(memory.alt) ? 'Open photo' : `Open photo: ${memory.alt}`}
      tabIndex={hasPhoto ? 0 : -1}
      className={cn(
        'group relative mx-3 flex w-24 shrink-0 flex-col items-center sm:mx-4 sm:w-28',
        hasPhoto ? 'cursor-pointer' : 'cursor-default',
      )}
    >
      {/* clip LED — the warm light that pins the photo to the wire */}
      <div className="relative z-10 -mb-1.5 h-4 w-2.5 rounded-[3px] bg-gradient-to-b from-paper/95 to-paper-dim/60 shadow-[0_0_10px_2px_rgba(247,171,77,0.65)]">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-200 shadow-[0_0_12px_5px_rgba(255,200,120,0.9)] animate-glow" />
      </div>

      {/* the print */}
      <div
        className={cn(
          'w-full rounded-[3px] bg-paper p-1.5 pb-2 shadow-[0_14px_28px_-14px_rgba(0,0,0,0.9)]',
          'transition duration-500 ease-out',
          TILTS[index % TILTS.length],
          'group-hover:z-20 group-hover:-translate-y-1.5 group-hover:rotate-0 group-hover:shadow-glow',
          'group-focus-visible:z-20 group-focus-visible:-translate-y-1.5 group-focus-visible:rotate-0 group-focus-visible:shadow-glow',
        )}
      >
        {hasPhoto ? (
          <div className="relative aspect-square overflow-hidden rounded-[2px] bg-night-900">
            <img
              src={wallThumb(memory.src)}
              alt={isPlaceholder(memory.alt) ? '' : memory.alt}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // If a thumbnail is missing (e.g. a custom photo with no
                // thumb-NN.jpg), fall back to the full image so it never breaks.
                const el = e.currentTarget;
                el.onerror = null;
                el.src = memory.src;
              }}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-[2px] border border-dashed border-night-600/80 bg-night-900/80 text-center">
            <span className="font-mono text-[8px] uppercase leading-tight tracking-wider text-haze/50">
              photo
              <br />
              here
            </span>
          </div>
        )}

        {showCaption && (
          <span className="block px-0.5 pt-1.5 text-center">
            {titleReal && (
              <span className="block truncate font-display text-[11px] italic leading-tight text-night-900/80">
                {fill(memory.title, content)}
              </span>
            )}
            {whenReal && (
              <span className="block truncate font-mono text-[8px] uppercase tracking-wide text-night-900/40">
                {fill(memory.when, content)}
              </span>
            )}
          </span>
        )}
      </div>
    </button>
  );
}

/**
 * One string of lights: a glowing wire with prints drifting along it like a
 * carousel. The track is two identical halves (each the row's photos repeated
 * until wider than the container), driven by useMarquee so translating by one
 * half lands seamlessly on the next. Even rows drift one way, odd the other;
 * hovering (or focusing) the row eases the drift down to a near-stop crawl.
 */
function StringRow({
  items,
  rowIndex,
  reduced,
  onOpen,
}: {
  items: Memory[];
  rowIndex: number;
  reduced: boolean;
  onOpen: (m: Memory) => void;
}) {
  const direction = rowIndex % 2 === 0 ? -1 : 1; // alternate drift left / right
  const { trackRef, slow, resume } = useMarquee({
    speed: SPEEDS[rowIndex % SPEEDS.length],
    direction,
    slowFactor: SLOW_FACTOR,
    enabled: !reduced,
  });

  if (reduced) {
    // No motion: a calm, centered, wrapped string.
    return (
      <div className="relative overflow-hidden pt-2">
        <Wire />
        <div className="relative z-10 flex flex-wrap justify-center gap-y-6">
          {items.map((m, i) => (
            <Photo key={i} memory={m} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    );
  }

  const reps = Math.max(2, Math.ceil(MIN_PER_HALF / items.length));
  const half = Array.from({ length: reps }).flatMap(() => items);
  const track = [...half, ...half];

  return (
    <div
      className="relative overflow-hidden pt-2"
      onPointerEnter={slow}
      onPointerLeave={resume}
      onFocus={slow}
      onBlur={resume}
    >
      <Wire />
      <div ref={trackRef} className="relative z-10 flex w-max will-change-transform">
        {track.map((m, i) => (
          <Photo key={i} memory={m} index={i} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

/**
 * The memories wall: photos clipped to warm LED string lights — small polaroids
 * hung from glowing clips along three wires that drift like carousels. Hover a
 * row to slow it to a crawl, click any photo to open it full-screen, and follow
 * the "more" button out to the full album. Photos live in content.ts.
 */
export function Memories() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Memory | null>(null);
  const rows = intoRows(content.memories.items, ROWS);

  return (
    <section id="memories" className="relative px-6 py-24 sm:py-28" aria-labelledby="memories-title">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 text-center sm:mb-16">
          <h2
            id="memories-title"
            className="font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl"
          >
            {fill(content.memories.title, content)}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty font-body text-haze">
            {fill(content.memories.intro, content)}
          </p>
        </Reveal>

        <div className="flex flex-col gap-y-12 sm:gap-y-14">
          {rows.map((row, r) => (
            <Reveal key={r} delay={Math.min(r, 4) * 90}>
              <StringRow items={row} rowIndex={r} reduced={reduced} onOpen={setActive} />
            </Reveal>
          ))}
        </div>

        {content.memories.moreHref.trim() !== '' && (
          <Reveal className="mt-16 flex flex-col items-center sm:mt-20">
            <a
              href={content.memories.moreHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-ember-400/45 bg-gradient-to-b from-night-700/70 to-night-800/80 px-7 py-3.5 font-display text-xl font-semibold text-paper shadow-glow-sm transition duration-300 hover:-translate-y-0.5 hover:border-ember-300/80 hover:text-ember-300 hover:shadow-glow"
            >
              {content.memories.moreLabel}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <p className="mt-3.5 max-w-sm text-center font-mono text-[11px] leading-relaxed tracking-wide text-haze/65">
              <span className="text-ember-400">*</span> {content.memories.moreNote}
            </p>
          </Reveal>
        )}
      </div>

      <Lightbox photo={active} onClose={() => setActive(null)} />
    </section>
  );
}

export default Memories;
