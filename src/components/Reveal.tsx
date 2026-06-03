import type { ReactNode } from 'react';
import { useInView } from '../lib/useInView';
import { useReducedMotion } from '../lib/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** Starting vertical offset in px. */
  y?: number;
}

/**
 * Fades + lifts its children into place the first time they scroll into view.
 * Respects prefers-reduced-motion by showing content immediately, no movement.
 */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView();
  const show = reduced || inView;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'none' : `translateY(${y}px)`,
        transition: reduced
          ? undefined
          : `opacity .85s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .85s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

export default Reveal;
