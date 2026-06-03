import { useEffect, useState } from 'react';
import content from '../config/content';
import { fill } from '../lib/text';
import { formatClock } from '../lib/datetime';
import { useReducedMotion } from '../lib/useReducedMotion';
import { Lantern } from './Lantern';

/**
 * The quiet thesis of the whole page, made literal: two clocks, two cities, one
 * lantern between them. Both tick live every second, each in its own timezone —
 * so however far apart the hours read, it's still the same minute, same sky.
 */
export function Footer() {
  const reduced = useReducedMotion();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative px-6 pb-16 pt-12 text-center">
      <div className="mx-auto max-w-2xl">
        {/* Dual live clock */}
        <div className="flex items-center justify-center gap-4 sm:gap-12">
          <Clock
            place={`${content.from.city} · ${content.from.code}`}
            time={formatClock(now, content.timezones.from)}
          />

          <Lantern className="w-6 shrink-0" glow={!reduced} flame={!reduced} />

          <Clock
            place={`${content.to.city} · ${content.to.code}`}
            time={formatClock(now, content.timezones.to)}
          />
        </div>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-ember-300/80">
          {fill(content.footer.sameSkyLine, content)}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-pretty font-body text-xs leading-relaxed text-haze/55">
          {fill(content.footer.madeWith, content)}
        </p>
        <p className="mt-6 font-mono text-[10px] text-haze/35">
          {content.from.code} ⇄ {content.to.code} · {now.getFullYear()}
        </p>
      </div>
    </footer>
  );
}

function Clock({ place, time }: { place: string; time: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-xl tabular-nums text-paper sm:text-3xl">{time}</span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-haze/60">{place}</span>
    </div>
  );
}

export default Footer;
