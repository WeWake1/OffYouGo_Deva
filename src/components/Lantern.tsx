import type { CSSProperties } from 'react';
import { cn } from '../lib/cn';

interface LanternProps {
  className?: string;
  style?: CSSProperties;
  /** Gentle glow pulse + flame flicker (turn off for the calm/static state). */
  glow?: boolean;
  /** Show the little flame at the base. */
  flame?: boolean;
}

/**
 * A stylized Pingxi-style sky lantern, built entirely in CSS (see the
 * `.lantern*` rules in index.css). Purely decorative, so it's aria-hidden.
 * Reused at every scale: the hero, the drifting background, and the notes.
 */
export function Lantern({ className, style, glow = true, flame = true }: LanternProps) {
  return (
    <div className={cn('lantern', className)} style={style} aria-hidden="true">
      <span className="lantern__cap" />
      <span className={cn('lantern__body', glow && 'animate-glow')} />
      {flame && <span className={cn('lantern__flame', glow && 'animate-flicker')} />}
    </div>
  );
}

export default Lantern;
