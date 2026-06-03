/** Date/time helpers built on the platform Intl API — no timezone library. */

/** "30 November 2026", rendered in a specific timezone. */
export function formatLongDate(iso: string, timeZone: string, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(new Date(iso));
}

/** "10:04 pm" in a given timezone — 12-hour with am/pm by default. */
export function formatClock(date: Date, timeZone: string, locale = 'en-GB', hour12 = true): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
    timeZone,
  }).format(date);
}

/** Whole days between two instants (used for "Day X of Y"). */
export function daysBetween(fromISO: string, toISO: string): number {
  const ms = new Date(toISO).getTime() - new Date(fromISO).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

/** "30 MAY" — short, upper-case day + month for the boarding-pass fields. */
export function formatTicketDate(iso: string, timeZone: string, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', timeZone })
    .format(new Date(iso))
    .toUpperCase();
}
