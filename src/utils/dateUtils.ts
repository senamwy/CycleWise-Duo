/**
 * Calendar-date helpers that work on the user's *local* calendar day.
 *
 * Cycle data is stored as plain `YYYY-MM-DD` strings. Mixing those with
 * `Date#toISOString()` (UTC) or `new Date('YYYY-MM-DD')` (parsed as UTC
 * midnight) shifts dates by one day in non-UTC time zones, and dividing
 * millisecond differences by 24h breaks across daylight-saving switches.
 * Always go through these helpers for date-only values.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Formats a Date as `YYYY-MM-DD` using its local calendar day. */
export function toLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parses `YYYY-MM-DD` as local midnight (unlike `new Date(str)`, which uses UTC). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Today's local date shifted by `days`, as `YYYY-MM-DD`. */
export function localDateStringFromToday(days: number, today: Date = new Date()): string {
  const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
  return toLocalDateString(dt);
}

/** Whole calendar days from `from` to `to` (DST-safe; ignores time of day). */
export function calendarDaysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / MS_PER_DAY);
}
