/**
 * Dates here are calendar dates, not instants: a date input gives "2026-02-01",
 * which `new Date()` reads as UTC midnight. Formatting that in any negative-offset
 * timezone renders the previous day — which showed "Feb 2026" as "Jan 2026" on
 * every entry. Both ends of the trip are pinned to UTC so the calendar date a
 * student typed is the calendar date everyone sees.
 */

/** Parse a yyyy-mm-dd value from a <input type="date"> into a UTC-anchored Date. */
export function parseDateInput(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatRange(start: Date, end: Date | null): string {
  return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : "Present"}`;
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
