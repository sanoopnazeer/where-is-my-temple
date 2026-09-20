const DATE_FORMAT: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }

/** "May 1, 2024" for a single-day Event, "May 1 – May 3, 2024" for a
 * multi-day one — derived directly from the real stored startDate/endDate,
 * no Malayalam-calendar conversion (out of scope for V1, CLAUDE.md §4). */
export function formatEventDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', DATE_FORMAT)
  }

  const startLabel = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const endLabel = end.toLocaleDateString('en-US', DATE_FORMAT)
  return `${startLabel} – ${endLabel}`
}

/** "1-Day Event" / "3-Day Event" — a day-span computed from the real
 * stored dates, not an invented duration claim. Event dates are stored
 * day-only (`src/collections/Events.ts`), so this is expressed in days,
 * not hours. */
export function eventDurationLabel(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
  return `${days}-Day Event`
}
