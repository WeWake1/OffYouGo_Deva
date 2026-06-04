import { useEffect, useRef, useState } from 'react';
import content from '../config/content';
import { fill, isPlaceholder } from '../lib/text';
import { cn } from '../lib/cn';
import { asset } from '../lib/asset';
import { useReducedMotion } from '../lib/useReducedMotion';
import { Reveal } from './Reveal';

/**
 * The letter — the part she'll reread. It's long on purpose, so instead of
 * wedging the whole thing into the page (and making everything below it a long
 * scroll), we show a short teaser of the opening on a warm parchment sheet. The
 * teaser is clickable and there's a clear "read the whole letter" button; either
 * one opens the full letter in a focused, full-screen reading view (LetterReader)
 * with its own scroll, so reading it becomes a calm, distraction-free moment.
 *
 * Hidden in there: swipe the open letter LEFT and the whole sheet flips over to
 * a secret second letter (content.letter.hidden). A ‹›-chevron + arrow keys are
 * wired up too, so the flip still works on desktop and for screen readers.
 *
 * Body copy comes from content.letter; any unwritten [[placeholder]] is shown
 * dimmed + italic so it's obviously a draft and never ships as "real".
 */

// How many opening paragraphs the inline teaser shows before it fades out and
// hands off to the full-screen reader. Keeps the page short and skimmable.
const PREVIEW_PARAGRAPHS = 3;
// A horizontal drag past this many px (and more sideways than vertical) counts
// as a "flip" swipe rather than a tap or a scroll.
const SWIPE_THRESHOLD = 60;

/**
 * The main letter's parchment contents. `full` renders the entire letter
 * (greeting, every paragraph, sign-off + signature, and the P.S.); without it
 * we show just the opening beats for the teaser. Shared so the teaser and the
 * reader stay in perfect sync — write the letter once, in content.ts.
 */
function Sheet({ full }: { full: boolean }) {
  const { greeting, paragraphs, signoff, signature, ps } = content.letter;
  const filledGreeting = fill(greeting, content);
  const filledSignature = fill(signature, content);
  const shown = full ? paragraphs : paragraphs.slice(0, PREVIEW_PARAGRAPHS);

  return (
    <>
      <p
        className={cn(
          'font-display text-2xl italic sm:text-3xl',
          isPlaceholder(filledGreeting) ? 'text-night-900/40' : 'text-night-800',
        )}
      >
        {filledGreeting}
      </p>

      <div className="mt-6 space-y-5">
        {shown.map((para, i) => (
          <p
            key={i}
            className={cn(
              'font-body text-[15px] leading-relaxed sm:text-base',
              isPlaceholder(para) ? 'italic text-night-900/45' : 'text-night-900/85',
            )}
          >
            {fill(para, content)}
          </p>
        ))}
      </div>

      {full && (
        <>
          <div className="mt-9">
            <p className="font-body text-night-900/70">{fill(signoff, content)}</p>
            <p
              className={cn(
                'mt-1 font-display text-3xl italic',
                isPlaceholder(filledSignature) ? 'text-night-900/40' : 'text-night-900',
              )}
            >
              {filledSignature}
            </p>
          </div>

          {ps.trim() !== '' && (
            <p className="mt-8 border-t border-night-900/10 pt-5 font-mono text-xs leading-relaxed text-night-900/55">
              {fill(ps, content)}
            </p>
          )}
        </>
      )}
    </>
  );
}

/**
 * The secret flip-side letter: a lead-up, the flower photo (or a "drop a photo
 * here" slot while it's blank), then the pay-off, with the final line blown up
 * as a closing flourish. The opening line is set big in the display face so it
 * reads as a cheeky reveal.
 */
function HiddenSheet() {
  const { paragraphsBefore, image, imageAlt, imageCaption, paragraphsAfter } = content.letter.hidden;
  const hasImage = image.trim() !== '' && !isPlaceholder(image);
  const hasCaption = imageCaption.trim() !== '' && !isPlaceholder(imageCaption);

  return (
    <>
      <div className="space-y-5">
        {paragraphsBefore.map((para, i) => (
          <p
            key={i}
            className={cn(
              i === 0
                ? 'font-display text-lg text-night-800 sm:text-xl'
                : 'font-body text-[15px] leading-relaxed sm:text-base',
              i !== 0 && (isPlaceholder(para) ? 'italic text-night-900/45' : 'text-night-900/85'),
            )}
          >
            {fill(para, content)}
          </p>
        ))}
      </div>

      {/* The flower. */}
      <figure className="my-8">
        {hasImage ? (
          <img
            src={asset(image)}
            alt={isPlaceholder(imageAlt) ? '' : imageAlt}
            className="mx-auto max-h-[58vh] w-auto max-w-full rounded-lg object-contain shadow-[0_18px_50px_-20px_rgba(0,0,0,0.55)]"
          />
        ) : (
          <div className="mx-auto flex aspect-[4/3] w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-night-900/25 bg-night-900/[0.04] text-center">
            <span className="font-mono text-[10px] uppercase leading-tight tracking-widest text-night-900/40">
              flower
              <br />
              photo here
            </span>
          </div>
        )}
        {hasCaption && (
          <figcaption className="mt-3 text-center font-display text-base italic text-night-900/70">
            {fill(imageCaption, content)}
          </figcaption>
        )}
      </figure>

      <div className="space-y-5">
        {paragraphsAfter.map((para, i) => {
          const isCloser = i === paragraphsAfter.length - 1;
          return (
            <p
              key={i}
              className={cn(
                isCloser
                  ? 'pt-3 text-center font-display text-2xl font-semibold italic text-night-900 sm:text-3xl'
                  : 'font-body text-[15px] leading-relaxed sm:text-base',
                !isCloser && (isPlaceholder(para) ? 'italic text-night-900/45' : 'text-night-900/85'),
              )}
            >
              {fill(para, content)}
            </p>
          );
        })}
      </div>
    </>
  );
}

// Shared parchment shell so the front and the flip side look like the same sheet.
const SHEET_SHELL =
  'mx-auto max-w-2xl rounded-2xl bg-gradient-to-b from-paper to-paper-dim px-7 py-10 text-night-900 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] sm:px-12 sm:py-14';

/** A small chevron control — the desktop/keyboard way to flip, kept subtle. */
function FlipChevron({
  side,
  show,
  pulse,
  label,
  onClick,
}: {
  side: 'left' | 'right';
  show: boolean;
  pulse: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      tabIndex={show ? 0 : -1}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/20 bg-night-800/55 text-paper/75 backdrop-blur-sm transition',
        'hover:border-ember-400/70 hover:text-ember-300 hover:opacity-100',
        side === 'left' ? 'left-2 sm:left-4' : 'right-2 sm:right-4',
        show ? 'opacity-60' : 'pointer-events-none opacity-0',
        show && pulse && 'animate-pulse',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={side === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  );
}

/**
 * Full-screen reading view. Opens over a dark scrim; Esc, the backdrop, or the
 * close button all dismiss it, background scroll is locked while open, and focus
 * moves to the close button. Mirrors Lightbox.tsx so the two full-screen
 * surfaces feel like the same gesture.
 *
 * If a secret letter is enabled, the sheet is a 3D flip card: the front is the
 * real letter, the back is the secret. Swipe left (or →, or the › chevron) to
 * turn it over; swipe right (or ←, or ‹) to turn back. Each face scrolls on its
 * own, so both long letters stay readable.
 */
function LetterReader({
  open,
  onClose,
  title,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();
  const hasHidden = content.letter.hidden.enabled;
  const [flipped, setFlipped] = useState(false);

  // Always open on the front, even if it was left flipped last time.
  useEffect(() => {
    if (open) setFlipped(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (hasHidden && e.key === 'ArrowRight') setFlipped(true);
      else if (hasHidden && e.key === 'ArrowLeft') setFlipped(false);
    };
    document.addEventListener('keydown', onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose, hasHidden]);

  if (!open) return null;

  const titleEyebrow = !isPlaceholder(title) && (
    <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-widest text-night-900/45">
      {title}
    </p>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isPlaceholder(title) ? 'Letter' : `Letter: ${title}`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm animate-fade-in"
    >
      {/* Top bar — page dots on the left, close button on the right. */}
      <div className="relative z-30 flex shrink-0 items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        {hasHidden ? (
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className={cn('h-1.5 w-1.5 rounded-full transition', !flipped ? 'bg-ember-400' : 'bg-paper/30')} />
            <span className={cn('h-1.5 w-1.5 rounded-full transition', flipped ? 'bg-ember-400' : 'bg-paper/30')} />
          </div>
        ) : (
          <span />
        )}

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close letter"
          className="group flex items-center gap-2 rounded-full border border-paper/25 bg-night-800/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-paper/85 transition hover:border-ember-400/70 hover:bg-night-700/70 hover:text-paper hover:shadow-glow-sm"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          close
        </button>
      </div>

      {/* The reading stage. */}
      {hasHidden ? (
        <div
          className="relative min-h-0 flex-1 [perspective:2500px]"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            // Only a clear sideways swipe flips — taps and vertical scrolls don't.
            if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;
            setFlipped(dx < 0); // swipe left → reveal the secret; right → back
          }}
        >
          <div
            className={cn(
              'relative h-full w-full [transform-style:preserve-3d]',
              reduced ? '' : 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            )}
            style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Front — the real letter. */}
            <div className="absolute inset-0 overflow-y-auto px-4 pb-16 [backface-visibility:hidden] sm:px-8">
              <article onClick={(e) => e.stopPropagation()} className={cn(SHEET_SHELL, 'border border-paper-dim/70')}>
                {titleEyebrow}
                <Sheet full />
              </article>
            </div>

            {/* Back — the secret, pre-flipped so it reads upright when turned. */}
            <div className="absolute inset-0 overflow-y-auto px-4 pb-16 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:px-8">
              <article
                onClick={(e) => e.stopPropagation()}
                className={cn(SHEET_SHELL, 'border border-ember-400/30 border-t-2 border-t-ember-400/60')}
              >
                <HiddenSheet />
              </article>
            </div>
          </div>

          <FlipChevron side="right" show={!flipped} pulse={!reduced} label="Turn the letter over" onClick={() => setFlipped(true)} />
          <FlipChevron side="left" show={flipped} pulse={false} label="Turn back to the letter" onClick={() => setFlipped(false)} />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-16 sm:px-8">
          <article onClick={(e) => e.stopPropagation()} className={cn(SHEET_SHELL, 'border border-paper-dim/70')}>
            {titleEyebrow}
            <Sheet full />
          </article>
        </div>
      )}
    </div>
  );
}

export function Letter() {
  const filledTitle = fill(content.letter.title, content);
  const [open, setOpen] = useState(false);

  return (
    <section id="letter" className="relative px-6 py-24 sm:py-32" aria-labelledby="letter-title">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-10 text-center">
          <h2
            id="letter-title"
            className="font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl"
          >
            {filledTitle}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          {/* The teaser: a tap target for the whole sheet. The visible button
              below is the keyboard/AT path; this is a mouse convenience. */}
          <div
            className="group relative cursor-pointer"
            onClick={() => setOpen(true)}
            aria-hidden="true"
          >
            {/* Warm light spilling out from behind the page. */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-ember-500/20 blur-2xl transition duration-500 group-hover:bg-ember-500/30" />

            <article className="relative -rotate-[0.6deg] overflow-hidden rounded-2xl border border-paper-dim/70 bg-gradient-to-b from-paper to-paper-dim px-7 py-10 text-night-900 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] transition duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-0 group-hover:shadow-glow sm:px-12 sm:py-14">
              {/* expand hint, surfaces on hover */}
              <span
                className="pointer-events-none absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-night-900/5 text-night-900/45 opacity-0 transition duration-300 group-hover:opacity-100"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              </span>

              <Sheet full={false} />

              {/* The opening dissolves into the page, hinting there's more. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-paper-dim" />
            </article>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="group inline-flex items-center gap-2.5 rounded-full border border-ember-400/45 bg-gradient-to-b from-night-700/70 to-night-800/80 px-7 py-3.5 font-display text-lg font-semibold text-paper shadow-glow-sm transition duration-300 hover:-translate-y-0.5 hover:border-ember-300/80 hover:text-ember-300 hover:shadow-glow"
          >
            read the whole letter
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </button>
        </Reveal>
      </div>

      <LetterReader open={open} onClose={() => setOpen(false)} title={filledTitle} />
    </section>
  );
}

export default Letter;
