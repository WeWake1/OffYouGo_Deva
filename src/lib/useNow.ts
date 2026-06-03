import { useEffect, useState } from 'react';

/**
 * The current instant (ms since epoch), re-read on an interval so live clocks
 * and progress rings tick on their own. Defaults to once a second; pass a larger
 * interval for things that only need to refresh occasionally.
 */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
