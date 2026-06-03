import { Fragment, useEffect, useState } from 'react';
import content from '../config/content';
import { fill } from '../lib/text';
import { entrance } from '../lib/anim';
import { cn } from '../lib/cn';
import { formatLongDate, formatClock } from '../lib/datetime';
import { useReducedMotion } from '../lib/useReducedMotion';
import { Lantern } from './Lantern';

/**
 * Opening moment. Names the occasion and runs the single, orchestrated
 * page-load reveal (staggered entrances), triggered once after mount.
 *
 * React Bits seam: the <h1> is the obvious swap point for an animated-text
 * component (e.g. SplitText / BlurText) — replace the heading markup only.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const show = reduced || shown;

  const titleParts = content.hero.title.split('{her}');
  const depDate = formatLongDate(content.departureISO, content.timezones.from);
  const depTime = formatClock(new Date(content.departureISO), content.timezones.from);

  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
      aria-labelledby="hero-title"
    >
      {/* Hero lantern with a soft halo */}
      <div className="relative mb-8" style={entrance(show, 0, reduced, 0)}>
        <div className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/25 blur-3xl" />
        <Lantern className={cn('w-24 sm:w-28', !reduced && 'animate-float')} />
      </div>

      <p
        className="mb-5 font-mono text-[11px] uppercase tracking-widest text-ember-400/90 sm:text-xs"
        style={entrance(show, 150, reduced)}
      >
        {fill(content.hero.kicker, content)}
      </p>

      <h1
        id="hero-title"
        className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-paper sm:text-6xl md:text-7xl"
        style={entrance(show, 300, reduced)}
      >
        {titleParts.map((part, i) => (
          <Fragment key={i}>
            {fill(part, content)}
            {i < titleParts.length - 1 && (
              <span className="glow-text italic text-ember-300">{content.herShortName}</span>
            )}
          </Fragment>
        ))}
      </h1>

      <p
        className="mt-6 max-w-xl text-pretty font-body text-base leading-relaxed text-haze sm:text-lg"
        style={entrance(show, 480, reduced)}
      >
        {fill(content.hero.subtitle, content)}
      </p>

      <div
        className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] text-haze/75 sm:text-xs"
        style={entrance(show, 640, reduced)}
      >
        <span className="text-ember-300/90">
          {content.from.code} <span className="text-haze/50">→</span> {content.to.code}
        </span>
        <span aria-hidden className="text-haze/30">
          ·
        </span>
        <span>~{content.distanceKm.toLocaleString()} km apart</span>
        <span aria-hidden className="text-haze/30">
          ·
        </span>
        <span>
          leaving {depDate}, {depTime}
        </span>
      </div>

      {/* Scroll cue pinned near the bottom */}
      <div
        className="absolute bottom-8 flex flex-col items-center gap-2 text-haze/70"
        style={entrance(show, 850, reduced)}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          {fill(content.hero.scrollCue, content)}
        </span>
        <svg
          className={cn('h-4 w-4', !reduced && 'animate-nudge')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;
