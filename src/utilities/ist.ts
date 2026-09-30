/**
 * India Standard Time helpers. Temple ritual/darshan times are Kerala
 * wall-clock times and Event dates are Kerala calendar days, so they are
 * always formatted and compared in IST — never in the server process's own
 * time zone, which is typically UTC on a production host. IST is a fixed
 * UTC+05:30 offset with no daylight saving.
 */
export const IST_TIME_ZONE = 'Asia/Kolkata'

const IST_UTC_OFFSET = '+05:30'

/** Time of day in IST, e.g. "06:30 am" (the site's existing 'en-IN' format). */
export function formatIstTime(value: string | Date): string {
  return new Date(value).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: IST_TIME_ZONE,
  })
}

/** A date formatted as its IST calendar day, e.g. "May 1, 2027". */
export function formatIstDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions,
  locale = 'en-US',
): string {
  return new Date(value).toLocaleDateString(locale, { ...options, timeZone: IST_TIME_ZONE })
}

const istDayParts = new Intl.DateTimeFormat('en-US', {
  timeZone: IST_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** The IST calendar day an instant falls on, as `YYYY-MM-DD`. */
export function istCalendarDay(value: string | Date): string {
  const parts = Object.fromEntries(
    istDayParts.formatToParts(new Date(value)).map((part) => [part.type, part.value]),
  )
  return `${parts.year}-${parts.month}-${parts.day}`
}

/** The instant an IST calendar day (`YYYY-MM-DD`) begins. */
export function startOfIstDay(day: string): Date {
  return new Date(`${day}T00:00:00.000${IST_UTC_OFFSET}`)
}

/** `YYYY-MM-DD` shifted by a number of calendar days. */
export function addCalendarDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** Whole calendar days from one `YYYY-MM-DD` to another. */
export function calendarDaysBetween(fromDay: string, toDay: string): number {
  return Math.round(
    (Date.parse(`${toDay}T00:00:00.000Z`) - Date.parse(`${fromDay}T00:00:00.000Z`)) / 86_400_000,
  )
}
