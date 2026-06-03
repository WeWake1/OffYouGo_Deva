import content from '../config/content';
import { fill } from '../lib/text';
import { useCountdown } from '../lib/useCountdown';
import { formatLongDate, formatClock, formatTicketDate } from '../lib/datetime';
import { useReducedMotion } from '../lib/useReducedMotion';
import { cn } from '../lib/cn';
import { Reveal } from './Reveal';
import { Lantern } from './Lantern';

const pad = (n: number) => n.toString().padStart(2, '0');

/**
 * The emotional centerpiece, rendered as a warm paper boarding pass laid on the
 * night sky. The left "pass" carries the journey (passenger, route, flight,
 * date, class); the right perforated "stub" holds the live, every-second
 * countdown to her return — the ticket and the clock fused into one object.
 *
 * Still the countdown at heart: useCountdown drives it, the departure→return
 * progress is reborn as the dashed flight path with a lantern riding the tip,
 * an sr-only summary keeps it accessible, and reduced-motion calms every
 * moving part.
 *
 * React Bits seam: the big "days" number on the stub is a natural home for a
 * CountUp / rolling-number component — swap that one span without touching the
 * ticket around it.
 */
export function Countdown() {
  const reduced = useReducedMotion();
  const t = useCountdown(content.returnISO);
  const bp = content.boardingPass;

  const returnDate = formatLongDate(content.returnISO, content.timezones.from);
  const subline = fill(content.countdown.subline, content).replace('{returnDate}', returnDate);

  const depDate = formatTicketDate(content.departureISO, content.timezones.from);
  const depTime = formatClock(new Date(content.departureISO), content.timezones.from);

  // Progress across the whole time apart (departure → return) — the flight path.
  const depMs = new Date(content.departureISO).getTime();
  const retMs = new Date(content.returnISO).getTime();
  const span = Math.max(1, retMs - depMs);
  const fraction = Math.min(1, Math.max(0, (span - t.total) / span));
  const totalDays = Math.round(span / 86_400_000);
  const dayX = Math.min(totalDays, Math.max(0, Math.round(fraction * totalDays)));

  const kicker = t.done ? content.countdown.doneTitle : content.countdown.lead;
  const caption = t.done
    ? fill(content.countdown.doneMessage, content)
    : subline;
  const stampText = t.done ? 'LANDED' : bp.stamp;

  return (
    <section
      id="countdown"
      className="relative px-6 py-24 sm:py-32"
      aria-label="Boarding pass and countdown to her return"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-9 text-center sm:mb-11">
          <p className="text-balance font-mono text-[11px] uppercase tracking-widest text-ember-400/90 sm:text-xs">
            {fill(kicker, content)}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <article
            className={cn(
              'ticket-paper relative grid overflow-hidden rounded-[20px] text-ticket-ink',
              'grid-cols-1 sm:grid-cols-[1fr_minmax(196px,228px)]',
              'shadow-[0_44px_92px_-34px_rgba(0,0,0,0.78)] ring-1 ring-black/5',
            )}
          >
            {/* ───────────── main pass: the journey ───────────── */}
            <div className="relative px-6 py-7 sm:px-9 sm:py-9">
              {/* brand */}
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-ticket-stamp">
                ✦ {fill(bp.brand, content)}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ticket-label">
                {fill(bp.airline, content)}
              </div>

              {/* passenger */}
              <div className="mt-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ticket-label">
                  passenger
                </div>
                <h2 className="mt-0.5 font-display text-2xl font-semibold leading-none text-ticket-ink sm:text-3xl">
                  {content.herName}
                </h2>
              </div>

              {/* route + flight path */}
              <div className="mt-6 flex items-center gap-3 sm:gap-5">
                <Endpoint label="from" code={content.from.code} city={content.from.city} />
                <div className="relative h-10 flex-1">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-ticket-ink/30" />
                  <div
                    className="absolute top-1/2 left-0 -translate-y-1/2 border-t-2 border-ember-600"
                    style={{ width: `${fraction * 100}%` }}
                  />
                  <span
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${fraction * 100}%` }}
                    aria-hidden="true"
                  >
                    <Lantern className="w-4" glow={!reduced} flame={false} />
                  </span>
                </div>
                <Endpoint label="to" code={content.to.code} city={content.to.city} align="right" />
              </div>
              <p className="mt-2 text-center font-mono text-[10px] tracking-wide text-ticket-label">
                {fill(content.countdown.progressNote, content)}
              </p>

              {/* fields */}
              <div className="mt-7 grid grid-cols-3 gap-x-4 gap-y-5">
                <Field label="flight" value={fill(bp.flightCode, content)} />
                <Field label="date" value={depDate} />
                <Field label="boards" value={depTime} />
                <Field label="class" value={fill(bp.travelClass, content)} />
                <Field label="gate" value="06" />
                <Field label="day" value={`${dayX} / ${totalDays}`} />
              </div>

              {/* barcode */}
              <div className="mt-7 flex items-center gap-4">
                <div className="ticket-barcode h-9 flex-1 rounded-sm" aria-hidden="true" />
                <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-ticket-label">
                  {content.from.code}
                  {content.to.code}·{fill(bp.flightCode, content)}
                </span>
              </div>

              {/* diagonal rubber stamp */}
              {stampText && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-8 -rotate-[15deg] rounded border-2 border-ticket-stamp px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ticket-stamp opacity-50 sm:right-10 sm:top-9"
                >
                  {stampText}
                </span>
              )}
            </div>

            {/* ───────────── stub: the live countdown ───────────── */}
            <div className="ticket-edge flex flex-row items-end justify-between gap-5 border-t-2 border-dotted border-ticket-ink/25 px-6 py-7 sm:flex-col sm:items-stretch sm:justify-between sm:border-l-2 sm:border-t-0">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ticket-label">
                  {fill(bp.daysLabel, content)}
                </div>
                <div
                  aria-hidden="true"
                  className="mt-1 font-mono text-5xl font-bold leading-none tabular-nums text-ticket-ink sm:text-6xl"
                >
                  {t.done ? 0 : t.days}
                </div>
                <div aria-hidden="true" className="mt-3 font-mono text-2xl font-bold tabular-nums text-ticket-ink/75 sm:text-[28px]">
                  {pad(t.hours)}:{pad(t.minutes)}:
                  <span className="text-ember-600">{pad(t.seconds)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-right sm:text-left">
                <StubField label="seat" value={fill(bp.seat, content)} />
                <StubField
                  label="status"
                  value={fill(t.done ? bp.arrivedStatus : bp.status, content)}
                />
              </div>
            </div>
          </article>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-7 max-w-xl text-balance text-center font-mono text-xs text-haze/80 sm:text-sm">
            {caption}
          </p>
        </Reveal>

        {/* Concise, non-live summary for screen readers. */}
        <p className="sr-only-custom">
          {t.done
            ? `${content.herName} is home.`
            : `${t.days} days, ${t.hours} hours and ${t.minutes} minutes until ${content.herName} is home.`}
        </p>
      </div>
    </section>
  );
}

/** A city endpoint on the ticket: tiny label, big code, city underneath. */
function Endpoint({
  label,
  code,
  city,
  align = 'left',
}: {
  label: string;
  code: string;
  city: string;
  align?: 'left' | 'right';
}) {
  return (
    <div className={cn('shrink-0', align === 'right' && 'text-right')}>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ticket-label">{label}</div>
      <div className="font-display text-3xl font-semibold leading-none text-ticket-ink sm:text-4xl">
        {code}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ticket-label">
        {city}
      </div>
    </div>
  );
}

/** A labelled field in the main pass grid. */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ticket-label">{label}</div>
      <div className="mt-1 font-mono text-sm font-bold uppercase tabular-nums text-ticket-ink">
        {value}
      </div>
    </div>
  );
}

/** A labelled field on the stub (seat / status). */
function StubField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ticket-label">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold uppercase text-ticket-ink">{value}</div>
    </div>
  );
}

export default Countdown;
