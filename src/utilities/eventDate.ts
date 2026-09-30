import type { Where } from 'payload'

import {
  addCalendarDays,
  calendarDaysBetween,
  formatIstDate,
  istCalendarDay,
  startOfIstDay,
} from './ist'

/*
 * Event startDate/endDate are day-only values (`src/collections/Events.ts`),
 * but Payload stores them as full instants whose time of day is incidental
 * (the admin date picker pins it near 12:00 UTC, i.e. ~17:00 IST). Each one
 * therefore represents the IST calendar day it falls on, and an Event covers
 * every IST day from its start day through its end day inclusive. Every
 * Event date display, status and "upcoming"/"not ended" query goes through
 * this module so they can't disagree.
 */

export type EventStatus = 'past' | 'ongoing' | 'upcoming'

/**
 * Past / Ongoing / Upcoming, derived from the dates (never stored — no
 * `isUpcoming`). An Event is ongoing for the whole of its start and end
 * IST calendar days, not just between the stored instants.
 */
export function getEventStatus(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  now: Date = new Date(),
): EventStatus | undefined {
  const today = istCalendarDay(now)

  if (endDate && istCalendarDay(endDate) < today) return 'past'
  if (startDate && istCalendarDay(startDate) > today) return 'upcoming'
  if (startDate && endDate) return 'ongoing'

  return undefined
}

/**
 * Local API `where` for Events whose status is not 'past' (ongoing or
 * upcoming): the end date falls on today's IST day or later.
 */
export function notEndedEventsWhere(now: Date = new Date()): Where {
  return { endDate: { greater_than_equal: startOfIstDay(istCalendarDay(now)).toISOString() } }
}

/**
 * Local API `where` for Events whose status is 'upcoming': the start date
 * falls on a later IST day than today.
 */
export function upcomingEventsWhere(now: Date = new Date()): Where {
  const tomorrow = addCalendarDays(istCalendarDay(now), 1)
  return { startDate: { greater_than_equal: startOfIstDay(tomorrow).toISOString() } }
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }

/** "May 1, 2024" for a single-day Event, "May 1 – May 3, 2024" for a
 * multi-day one — derived directly from the real stored startDate/endDate,
 * no Malayalam-calendar conversion (out of scope for V1, CLAUDE.md §4). */
export function formatEventDateRange(startDate: string, endDate: string): string {
  if (istCalendarDay(startDate) === istCalendarDay(endDate)) {
    return formatIstDate(startDate, DATE_FORMAT)
  }

  const startLabel = formatIstDate(startDate, { month: 'long', day: 'numeric' })
  const endLabel = formatIstDate(endDate, DATE_FORMAT)
  return `${startLabel} – ${endLabel}`
}

/** "1-Day Event" / "3-Day Event" — a day-span computed from the real
 * stored dates, not an invented duration claim. Event dates are stored
 * day-only (`src/collections/Events.ts`), so this is expressed in days,
 * not hours. */
export function eventDurationLabel(startDate: string, endDate: string): string {
  const days = calendarDaysBetween(istCalendarDay(startDate), istCalendarDay(endDate)) + 1
  return `${days}-Day Event`
}
