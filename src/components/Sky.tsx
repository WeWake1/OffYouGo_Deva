import { lazy, Suspense, useMemo } from 'react';
import { Lantern } from './Lantern';
import { useReducedMotion } from '../lib/useReducedMotion';
import { cn } from '../lib/cn';
import type { CSSVars } from '../lib/anim';

// React Bits Galaxy (WebGL/ogl starfield) — lazy-loaded so the CSS gradient
// paints instantly and the ogl bundle is code-split out of the initial JS, the
// same treatment the Ballpit game gets. See src/components/reactbits/Galaxy.tsx.
const Galaxy = lazy(() => import('./reactbits/Galaxy'));

/**
 * The fixed atmospheric backdrop for the whole page: a warm-indigo gradient
 * mesh, the React Bits Galaxy starfield drifting/twinkling over it, and warm sky
 * lanterns rising on top. Purely decorative and non-interactive.
 *
 * Reduced motion swaps the WebGL galaxy for the calm hand-built CSS starfield so
 * nothing animates and no GL loop runs — same gradient + static lanterns.
 *
 * React Bits seam: the Galaxy sits just above `.sky-gradient` (it's transparent,
 * so the gradient shows through its stars). Swap it for another background
 * component here without touching the lanterns layered above.
 */
export function Sky() {
  const reduced = useReducedMotion();

  // Generated once so positions stay stable across re-renders (every second
  // for the countdown). Seeds are random per load, which is fine for decor.
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 0.6 + Math.random() * 1.9,
        baseOpacity: 0.35 + Math.random() * 0.5,
        dur: 3 + Math.random() * 5,
        delay: Math.random() * 6,
        warm: Math.random() > 0.82, // a few amber stars for warmth
      })),
    [],
  );

  const drifters = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: 8 + i * 19 + (Math.random() * 8 - 4),
        size: 26 + Math.random() * 26,
        dur: 34 + Math.random() * 26,
        delay: -(Math.random() * 40),
        drift: Math.random() * 8 - 4,
        opacity: 0.5 + Math.random() * 0.35,
      })),
    [],
  );

  // Fixed, calm placements for the reduced-motion fallback.
  const staticLanterns = [
    { left: 12, top: 22, size: 30, opacity: 0.5 },
    { left: 78, top: 16, size: 26, opacity: 0.45 },
    { left: 64, top: 40, size: 22, opacity: 0.4 },
    { left: 30, top: 54, size: 20, opacity: 0.35 },
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 sky-gradient" />

      {/* Starfield: the WebGL Galaxy when motion is allowed, else a calm static
          CSS starfield. The galaxy is transparent, so the gradient shows through
          its stars; tuned subtle (white, slow drift) to sit behind the content. */}
      {reduced ? (
        stars.map((s) => (
          <span
            key={s.id}
            className={cn('absolute rounded-full', s.warm ? 'bg-ember-300' : 'bg-paper')}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.baseOpacity,
              boxShadow: s.size > 1.8 ? '0 0 6px 1px rgba(255,232,190,0.6)' : undefined,
            }}
          />
        ))
      ) : (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <Galaxy
              mouseRepulsion={false}
              mouseInteraction
              density={1.4}
              glowIntensity={0.2}
              saturation={0.3}
              hueShift={360}
              twinkleIntensity={0.5}
              rotationSpeed={0.05}
              repulsionStrength={0.5}
              autoCenterRepulsion={0}
              starSpeed={0.1}
              speed={0.4}
            />
          </div>
        </Suspense>
      )}

      {/* Sky lanterns */}
      {reduced
        ? staticLanterns.map((l, i) => (
            <Lantern
              key={i}
              glow={false}
              style={{
                position: 'absolute',
                left: `${l.left}%`,
                top: `${l.top}%`,
                width: `${l.size}px`,
                opacity: l.opacity,
              }}
            />
          ))
        : drifters.map((l) => (
            <div
              key={l.id}
              className="absolute"
              style={
                {
                  left: `${l.left}%`,
                  bottom: '-14%',
                  width: `${l.size}px`,
                  animation: `rise ${l.dur}s linear ${l.delay}s infinite`,
                  '--rise-drift': `${l.drift}vw`,
                  '--rise-opacity': l.opacity,
                } as CSSVars
              }
            >
              <Lantern className="w-full animate-sway" />
            </div>
          ))}
    </div>
  );
}

export default Sky;
