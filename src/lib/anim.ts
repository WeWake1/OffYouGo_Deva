import type { CSSProperties } from 'react';

/** CSSProperties that also allows CSS custom properties (--var) in `style`. */
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Inline style for a staggered entrance (used by the on-load hero reveal).
 * When `reduced` is true it returns the final state with no transition.
 */
export function entrance(show: boolean, delay: number, reduced: boolean, y = 24): CSSProperties {
  return {
    opacity: show ? 1 : 0,
    transform: show ? 'none' : `translateY(${y}px)`,
    transition: reduced
      ? undefined
      : `opacity .9s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .9s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    willChange: 'opacity, transform',
  };
}
