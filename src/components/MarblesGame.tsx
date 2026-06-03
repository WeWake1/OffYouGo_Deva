import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import content from '../config/content';
import { fill } from '../lib/text';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useInView } from '../lib/useInView';
import { Reveal } from './Reveal';

/**
 * True on touch devices (a "coarse" pointer). Used to lighten the physics sim on
 * phones — fewer marbles, since the collision step is O(n²) — and to reword the
 * hint from "cursor" to "finger".
 */
function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return coarse;
}

// The React Bits Ballpit (three.js + gsap) is heavy — load it on demand, and
// only once the section scrolls into view, so it never weighs down the page.
const Ballpit = lazy(() => import('./reactbits/Ballpit'));

// Warm marble palette (hex ints). The Ballpit blends a gradient across these,
// and colors[0] also tints the cursor-led marble and its point light.
const MARBLE_COLORS = [0xffe0ad, 0xffc878, 0xef8f3c, 0xff7a3c, 0xe07a5f, 0x6fb1a8];

// Core/edge stops for the calm static marbles shown under reduced motion.
const STATIC_MARBLES = [
  { core: '#ffe0ad', edge: '#e0a23c' },
  { core: '#ffc878', edge: '#df8a2f' },
  { core: '#ffb38a', edge: '#d4582f' },
  { core: '#ff9fb0', edge: '#c0455e' },
  { core: '#cdb6ff', edge: '#6a4fb0' },
  { core: '#9fe0d4', edge: '#3f8d80' },
];

/** Renders nothing if the lazy WebGL chunk fails — the page still stands. */
class SafeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** A calm, static bowl of marbles for prefers-reduced-motion (no WebGL, no motion). */
function StaticMarbles() {
  return (
    <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-3 p-10">
      {Array.from({ length: 21 }).map((_, i) => {
        const c = STATIC_MARBLES[i % STATIC_MARBLES.length];
        return (
          <span
            key={i}
            className="h-9 w-9 rounded-full sm:h-10 sm:w-10"
            style={{
              background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${c.core} 30%, ${c.edge} 100%)`,
              boxShadow: `0 6px 14px -5px rgba(0,0,0,0.6), 0 0 16px -4px ${c.core}`,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * The closing toy: an interactive pit of marbles (the React Bits Ballpit — a
 * three.js physics sim). Run the cursor through them and a marble follows it,
 * shoving the rest around; they tumble, collide and settle. Mounts only once the
 * section scrolls into view, and reduced motion gets a calm static bowl instead.
 */
export function MarblesGame() {
  const reduced = useReducedMotion();
  const touch = useCoarsePointer();
  const cfg = content.marbles;
  const { ref, inView } = useInView<HTMLDivElement>();

  // Phones get a lighter pit (the O(n²) collision step gets expensive fast) and a
  // finger-worded hint instead of a cursor-worded one.
  const count = touch ? Math.min(cfg.count, 90) : cfg.count;
  const hint = touch ? fill(cfg.hint, content).replace('cursor', 'finger') : fill(cfg.hint, content);

  return (
    <section id="marbles" className="relative px-6 py-24 sm:py-28" aria-labelledby="marbles-title">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2
            id="marbles-title"
            className="font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl"
          >
            {fill(cfg.title, content)}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty font-body text-haze">{fill(cfg.intro, content)}</p>
        </Reveal>

        <Reveal delay={120}>
          <div
            ref={ref}
            className="relative mt-10 h-[360px] overflow-hidden rounded-3xl border border-ember-500/15 bg-night-900/40 shadow-[inset_0_0_90px_-24px_rgba(0,0,0,0.85)] sm:h-[520px]"
          >
            {reduced ? (
              <StaticMarbles />
            ) : (
              inView && (
                <SafeBoundary>
                  <Suspense fallback={null}>
                    <Ballpit count={count} colors={MARBLE_COLORS} followCursor />
                  </Suspense>
                </SafeBoundary>
              )
            )}

            {!reduced && (
              <p className="pointer-events-none absolute inset-x-0 bottom-5 z-10 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-haze/55">
                {hint}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default MarblesGame;
