import { useEffect, useMemo, useState } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Milliseconds remaining (clamped at 0). */
  total: number;
  /** True once the target instant has passed. */
  done: boolean;
}

function compute(targetMs: number): TimeLeft {
  const total = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
    total,
    done: total <= 0,
  };
}

/**
 * Live countdown to an ISO instant, re-computed every second.
 * Because the target is an absolute instant (ISO with offset), the result is
 * correct regardless of the viewer's own timezone.
 */
export function useCountdown(targetISO: string): TimeLeft {
  const targetMs = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [time, setTime] = useState(() => compute(targetMs));

  useEffect(() => {
    setTime(compute(targetMs)); // resync immediately if the target changes
    const id = window.setInterval(() => setTime(compute(targetMs)), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return time;
}
