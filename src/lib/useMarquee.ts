import { useCallback, useEffect, useRef } from 'react';

interface MarqueeOptions {
  /** Drift speed in pixels per second at full tilt. */
  speed: number;
  /** +1 drifts the track left, -1 drifts it right. */
  direction?: 1 | -1;
  /** Fraction of full speed to ease down to while hovered (e.g. 0.06 ≈ a crawl). */
  slowFactor?: number;
  /** Skip all motion (prefers-reduced-motion). */
  enabled?: boolean;
}

/**
 * Drives a seamless horizontal marquee by hand with requestAnimationFrame so the
 * speed can be eased smoothly — drastically slowed on hover, then back up — with
 * none of the jump a CSS `animation-duration` swap causes mid-flight.
 *
 * The track must hold two identical halves laid side by side; we translate by a
 * phase in [0,1) of the half-width, so wrapping from one half to the next lands
 * pixel-for-pixel on an identical frame and the loop never gaps. Returns the ref
 * to attach to the track plus `slow`/`resume` handlers for the row's hover area.
 */
export function useMarquee({ speed, direction = 1, slowFactor = 0.06, enabled = true }: MarqueeOptions) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const phase = useRef(0); // 0..1 along one half-width
  const current = useRef(speed); // eased current speed
  const target = useRef(speed); // where speed is heading

  useEffect(() => {
    target.current = speed;
    current.current = speed;
    if (!enabled) return;

    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last: number | null = null;

    const step = (t: number) => {
      if (last === null) last = t;
      const dt = Math.min(0.05, (t - last) / 1000); // clamp big gaps (tab switches)
      last = t;

      // Ease the live speed toward its target so hover transitions are smooth.
      current.current += (target.current - current.current) * Math.min(1, dt * 5);

      const half = track.scrollWidth / 2 || 1;
      let p = phase.current + (current.current * dt) / half * direction;
      p = ((p % 1) + 1) % 1; // wrap into [0,1)
      phase.current = p;
      track.style.transform = `translate3d(${-p * half}px, 0, 0)`;

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed, direction, enabled]);

  const slow = useCallback(() => {
    target.current = speed * slowFactor;
  }, [speed, slowFactor]);

  const resume = useCallback(() => {
    target.current = speed;
  }, [speed]);

  return { trackRef, slow, resume };
}
