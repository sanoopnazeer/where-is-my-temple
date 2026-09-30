import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterAll, describe, expect, it } from 'vitest'

import { TempleDailyRituals } from '@/components/temple/TempleDailyRituals'
import { TempleQuickInfo } from '@/components/temple/TempleQuickInfo'
import type { Temple } from '@/payload-types'
import {
  eventDurationLabel,
  formatEventDateRange,
  getEventStatus,
  notEndedEventsWhere,
  upcomingEventsWhere,
} from '@/utilities/eventDate'
import { formatIstDate, formatIstTime, istCalendarDay } from '@/utilities/ist'

/*
 * Ritual/darshan times and Event dates must render and compare in IST no
 * matter which time zone the server process runs in. Every assertion runs
 * under UTC (a typical production host) and a western zone.
 */

const originalTz = process.env.TZ
afterAll(() => {
  process.env.TZ = originalTz
})

const SERVER_TIME_ZONES = ['UTC', 'America/Los_Angeles']

function describeInServerTimeZones(name: string, fn: () => void) {
  for (const tz of SERVER_TIME_ZONES) {
    describe(`${name} (server TZ=${tz})`, () => {
      it('runs with the intended server time zone', () => {
        process.env.TZ = tz
        expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(tz)
      })
      fn()
    })
  }
}

/** An IST wall-clock moment, as the instant a server would see it. */
const ist = (local: string) => new Date(`${local}+05:30`)

// Values as the Payload admin actually stored them (entered from IST).
const DARSHAN_MORNING = { open: '2026-09-19T21:30:00.000Z', close: '2026-09-20T07:00:00.000Z' }
const RITUAL_START = '2026-09-20T09:30:00.000Z' // 15:00 IST

describeInServerTimeZones('IST time display', () => {
  it('formats a ritual time in IST', () => {
    expect(formatIstTime(RITUAL_START)).toBe('03:00 pm')
  })

  it('formats darshan open/close times in IST', () => {
    expect(formatIstTime(DARSHAN_MORNING.open)).toBe('03:00 am')
    expect(formatIstTime(DARSHAN_MORNING.close)).toBe('12:30 pm')
  })

  it('renders darshan timings in IST on the Temple page', () => {
    const temple = {
      darshanTimings: [{ id: 'd1', label: 'Morning', openTime: DARSHAN_MORNING.open, closeTime: DARSHAN_MORNING.close }],
    } as unknown as Temple

    const html = renderToStaticMarkup(createElement(TempleQuickInfo, { temple, locale: 'en' }))
    expect(html).toContain('03:00 am – 12:30 pm')
  })

  it('renders Daily Ritual times in IST on the Temple page', () => {
    const temple = {
      dailyRituals: [
        { id: 'r1', name: 'Nirmalyam', description: 'First darshan.', startTime: '2026-09-19T21:30:00.000Z', endTime: '2026-09-19T22:00:00.000Z' },
        { id: 'r2', name: 'Ucha Pooja', description: 'Noon pooja.', startTime: RITUAL_START, endTime: null },
        { id: 'r3', name: 'Untimed', description: 'No time stored.', startTime: '' },
      ],
    } as unknown as Temple

    const html = renderToStaticMarkup(createElement(TempleDailyRituals, { temple, locale: 'ml' }))
    const times = [...html.matchAll(/<span[^>]*lang="en"[^>]*>([^<]*)<\/span>/g)].map((m) => m[1])

    // start–end range, start only (no end time), and no pill at all without a start time
    expect(times).toEqual(['03:00 am – 03:30 am', '03:00 pm'])
    expect(html).toContain('Untimed')
  })
})

describeInServerTimeZones('IST calendar days', () => {
  it('reads each stored instant as the IST day it falls on', () => {
    expect(istCalendarDay('2027-05-01T11:30:00.000Z')).toBe('2027-05-01') // admin picker (~17:00 IST)
    expect(istCalendarDay('2026-11-01T00:00:00.000Z')).toBe('2026-11-01') // UTC midnight (05:30 IST)
    expect(istCalendarDay('2027-01-09T18:30:00.000Z')).toBe('2027-01-10') // IST midnight
  })

  it('formats Event dates as their IST day', () => {
    expect(formatIstDate('2027-01-09T18:30:00.000Z', { month: 'long', day: 'numeric' })).toBe('January 10')
    expect(formatIstDate('2027-01-09T18:30:00.000Z', { day: 'numeric' })).toBe('10')
    expect(formatEventDateRange('2027-01-09T18:30:00.000Z', '2027-01-09T18:30:00.000Z')).toBe(
      'January 10, 2027',
    )
    expect(formatEventDateRange('2027-05-01T11:30:00.000Z', '2027-05-03T11:30:00.000Z')).toBe(
      'May 1 – May 3, 2027',
    )
  })

  it('counts Event duration in IST calendar days', () => {
    expect(eventDurationLabel('2027-05-01T11:30:00.000Z', '2027-05-03T11:30:00.000Z')).toBe('3-Day Event')
    expect(eventDurationLabel('2027-01-09T18:30:00.000Z', '2027-01-09T18:30:00.000Z')).toBe('1-Day Event')
    expect(eventDurationLabel('2026-10-04T11:31:09.804Z', '2026-10-05T11:31:09.804Z')).toBe('2-Day Event')
  })
})

// A 3-day festival entered through the admin (dates pinned to ~17:00 IST).
const FESTIVAL = { start: '2027-05-01T11:30:00.000Z', end: '2027-05-03T11:30:00.000Z' }
// A 1-day event stored at UTC midnight (05:30 IST).
const ONE_DAY = { start: '2026-11-01T00:00:00.000Z', end: '2026-11-01T00:00:00.000Z' }

describeInServerTimeZones('Event status', () => {
  const status = (event: { start: string; end: string }, now: Date) =>
    getEventStatus(event.start, event.end, now)

  it('is upcoming until the start IST day begins', () => {
    expect(status(FESTIVAL, ist('2027-04-30T23:59:59.999'))).toBe('upcoming')
  })

  it('is ongoing for the whole start IST day, before the stored start instant', () => {
    expect(status(FESTIVAL, ist('2027-05-01T00:00:00.000'))).toBe('ongoing')
    expect(status(FESTIVAL, ist('2027-05-01T16:59:00.000'))).toBe('ongoing')
    expect(status(ONE_DAY, ist('2026-11-01T02:00:00.000'))).toBe('ongoing')
  })

  it('stays ongoing throughout the final IST day, after the stored end instant', () => {
    expect(status(FESTIVAL, ist('2027-05-03T17:30:00.000'))).toBe('ongoing')
    expect(status(FESTIVAL, ist('2027-05-03T23:59:59.999'))).toBe('ongoing')
    expect(status(ONE_DAY, ist('2026-11-01T06:00:00.000'))).toBe('ongoing')
    expect(status(ONE_DAY, ist('2026-11-01T23:59:59.999'))).toBe('ongoing')
  })

  it('is past once the day after the final IST day begins', () => {
    expect(status(FESTIVAL, ist('2027-05-04T00:00:00.000'))).toBe('past')
    expect(status(ONE_DAY, ist('2026-11-02T00:00:00.000'))).toBe('past')
  })
})

/** Evaluates the single-field range `where` the helpers build, the way the DB does. */
function matches(where: Record<string, unknown>, event: { startDate: string; endDate: string }) {
  const [field, condition] = Object.entries(where)[0] as [
    'startDate' | 'endDate',
    { greater_than_equal: string },
  ]
  return new Date(event[field]).getTime() >= new Date(condition.greater_than_equal).getTime()
}

describeInServerTimeZones('Home / Events queries agree with Event status', () => {
  const events = [FESTIVAL, ONE_DAY, { start: '2027-01-09T18:30:00.000Z', end: '2027-01-10T18:30:00.000Z' }]
  const nows = [
    ist('2026-10-31T23:59:59.999'),
    ist('2026-11-01T00:00:00.000'),
    ist('2026-11-01T12:00:00.000'),
    ist('2026-11-01T23:59:59.999'),
    ist('2026-11-02T00:00:00.000'),
    ist('2027-01-10T08:00:00.000'),
    ist('2027-01-11T23:00:00.000'),
    ist('2027-04-30T23:59:59.999'),
    ist('2027-05-01T00:00:00.000'),
    ist('2027-05-03T23:59:59.999'),
    ist('2027-05-04T00:00:00.000'),
  ]

  it('Home + Spotlight "not ended" query returns exactly the ongoing/upcoming Events', () => {
    for (const now of nows) {
      for (const e of events) {
        const doc = { startDate: e.start, endDate: e.end }
        expect(matches(notEndedEventsWhere(now), doc)).toBe(getEventStatus(e.start, e.end, now) !== 'past')
      }
    }
  })

  it('Events page + District sidebar "upcoming" query returns exactly the upcoming Events', () => {
    for (const now of nows) {
      for (const e of events) {
        const doc = { startDate: e.start, endDate: e.end }
        expect(matches(upcomingEventsWhere(now), doc)).toBe(getEventStatus(e.start, e.end, now) === 'upcoming')
      }
    }
  })

  it('bounds queries at IST midnight', () => {
    const now = ist('2027-05-03T21:00:00.000')
    expect(notEndedEventsWhere(now)).toEqual({ endDate: { greater_than_equal: '2027-05-02T18:30:00.000Z' } })
    expect(upcomingEventsWhere(now)).toEqual({ startDate: { greater_than_equal: '2027-05-03T18:30:00.000Z' } })
  })
})
