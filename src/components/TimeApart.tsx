import { memo } from 'react';
import content from '../config/content';
import { fill } from '../lib/text';
import { cn } from '../lib/cn';
import { useNow } from '../lib/useNow';
import { useReducedMotion } from '../lib/useReducedMotion';
import { Reveal } from './Reveal';

const DAY = 86_400_000;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Midnight (local) at the start of the day `ms` falls in. */
function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * One dot per day across the whole time apart: filled for days already gone, a
 * single glowing dot for today, dim for the days still ahead. Memoized on its
 * props so the per-second clock driving the rings never re-renders the grid —
 * it only changes when a day rolls over. Decorative (aria-hidden); the spoken
 * summary lives next to it in <TimeApart/>.
 */
const DotGrid = memo(function DotGrid({ total, elapsed }: { total: number; elapsed: number }) {
  return (
    <div
      aria-hidden="true"
      className="grid gap-[5px] [--c:18] sm:gap-[6px] sm:[--c:24] lg:[--c:28]"
      style={{ gridTemplateColumns: 'repeat(var(--c), minmax(0, 1fr))' }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'aspect-square rounded-full transition-colors duration-500',
            i < elapsed && 'bg-paper/85',
            i === elapsed && 'bg-flame shadow-[0_0_8px_2px_rgba(255,122,60,0.85)] animate-glow',
            i > elapsed && 'bg-night-600/40',
          )}
        />
      ))}
    </div>
  );
});

/** A single circular progress ring with a label in the middle, percent beneath. */
function Ring({
  value,
  center,
  ariaLabel,
  reduced,
  gradId,
}: {
  value: number;
  center: string;
  ariaLabel: string;
  reduced: boolean;
  gradId: string;
}) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const v = clamp01(value);

  return (
    <div className="flex flex-col items-center gap-2.5" role="img" aria-label={ariaLabel}>
      <div className="relative h-[76px] w-[76px]">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef8f3c" />
              <stop offset="100%" stopColor="#ffe0ad" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r={r} fill="none" strokeWidth="5" className="stroke-night-600/45" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke={`url(#${gradId})`}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - v)}
            style={{ transition: reduced ? undefined : 'stroke-dashoffset 0.7s cubic-bezier(.22,1,.36,1)' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[13px] font-bold uppercase tracking-tight text-ember-200">
          {center}
        </span>
      </div>
      <span className="font-mono text-xs tabular-nums text-haze/70">{Math.round(v * 100)}%</span>
    </div>
  );
}

/** A dark rounded card, matching the two stacked panels in the reference. */
function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-paper/10 bg-night-900/55 p-5 backdrop-blur-sm sm:p-7',
        'shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * "The days, one by one" — a tracker for the whole time apart. A dot-a-day grid
 * lights up as the days pass (today glows), and four live rings fill in real
 * time: the whole trip (departure → return), the current month, week and day.
 * Everything is computed from the journey dates + the viewer's local clock; only
 * the copy is editable, in content.ts.
 */
export function TimeApart() {
  const reduced = useReducedMotion();
  const now = useNow(1000);

  const depMs = new Date(content.departureISO).getTime();
  const retMs = new Date(content.returnISO).getTime();
  const span = Math.max(DAY, retMs - depMs);

  // ── The whole trip ─────────────────────────────────────────────────────
  const tripPct = clamp01((now - depMs) / span);
  const totalDays = Math.max(1, Math.round(span / DAY));
  const daysRemaining = Math.max(0, Math.ceil((retMs - now) / DAY));

  // Day-grid bookkeeping, aligned to local calendar midnights so dots flip at
  // midnight (not at the departure time). `elapsed` is also the index of today.
  const elapsed = Math.min(
    totalDays,
    Math.max(0, Math.round((startOfDay(now) - startOfDay(depMs)) / DAY)),
  );
  const currentDay = Math.min(elapsed + 1, totalDays);

  // ── Month / week / day (viewer-local) ──────────────────────────────────
  const d = new Date(now);
  const startMonth = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  const endMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
  const monthPct = clamp01((now - startMonth) / (endMonth - startMonth));

  const startToday = startOfDay(now);
  const dayPct = clamp01((now - startToday) / DAY);

  const dowMon = (d.getDay() + 6) % 7; // Mon = 0 … Sun = 6
  const weekPct = clamp01((dowMon * DAY + (now - startToday)) / (7 * DAY));

  const monthLabel = d.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
  const weekdayLabel = d.toLocaleString('en-GB', { weekday: 'short' }).toUpperCase();
  const hourLabel = `${d.getHours()}h`;

  return (
    <section id="time-apart" className="relative px-6 py-20 sm:py-24" aria-labelledby="time-apart-title">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-10 text-center sm:mb-12">
          <h2
            id="time-apart-title"
            className="font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl"
          >
            {fill(content.timeApart.title, content)}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty font-body text-haze">
            {fill(content.timeApart.intro, content)}
          </p>
        </Reveal>

        {/* ── The dot-a-day grid ── */}
        <Reveal delay={80}>
          <Panel>
            <div className="mb-5 flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ember-400/90">
                {fill(content.timeApart.gridLabel, content)}
              </span>
              <span className="font-mono text-sm font-bold tabular-nums text-ember-300">
                {(tripPct * 100).toFixed(1)}%
              </span>
            </div>

            <DotGrid total={totalDays} elapsed={elapsed} />

            <div className="mt-4 text-right font-mono text-[11px] tracking-wide tabular-nums text-haze/60">
              {currentDay} / {totalDays} days
            </div>

            <p className="sr-only-custom">
              Day {currentDay} of {totalDays} of the time apart — {Math.round(tripPct * 100)}% gone,{' '}
              {daysRemaining} days until {content.herName} is home.
            </p>
          </Panel>
        </Reveal>

        {/* ── The four live rings ── */}
        <Reveal delay={160}>
          <Panel className="mt-5 grid grid-cols-2 gap-y-6 sm:mt-6 sm:grid-cols-4">
            <Ring
              value={tripPct}
              center={`${daysRemaining}d`}
              ariaLabel={`${Math.round(tripPct * 100)} percent of the time apart done, ${daysRemaining} days remaining`}
              reduced={reduced}
              gradId="ring-trip"
            />
            <Ring
              value={monthPct}
              center={monthLabel}
              ariaLabel={`${Math.round(monthPct * 100)} percent of ${monthLabel} done`}
              reduced={reduced}
              gradId="ring-month"
            />
            <Ring
              value={weekPct}
              center={weekdayLabel}
              ariaLabel={`${Math.round(weekPct * 100)} percent of the week done`}
              reduced={reduced}
              gradId="ring-week"
            />
            <Ring
              value={dayPct}
              center={hourLabel}
              ariaLabel={`${Math.round(dayPct * 100)} percent of the day done`}
              reduced={reduced}
              gradId="ring-day"
            />
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}

export default TimeApart;
