import { describe, expect, it } from 'vitest'

import { getHomeData } from '@/app/(frontend)/getHomeData'
import { getEventsData } from '@/app/(frontend)/events/getEventsData'
import type { Event } from '@/payload-types'
import { getEventStatus } from '@/utilities/eventDate'

/*
 * Read-only checks of the real Home and Events page loaders against the
 * configured database: whatever Events exist, each list must only contain
 * Events whose derived status fits it, and must agree with the Event
 * collection's own virtual `status` field. Nothing is created or changed.
 */

const expectSortedByStart = (events: Event[]) => {
  const starts = events.map((event) => new Date(event.startDate ?? 0).getTime())
  expect(starts).toEqual([...starts].sort((a, b) => a - b))
}

describe('Home and Events loaders', () => {
  it('Home upcoming events are ongoing or upcoming, soonest first', async () => {
    const { upcomingEvents } = await getHomeData()

    for (const event of upcomingEvents) {
      expect(getEventStatus(event.startDate, event.endDate)).not.toBe('past')
      expect(event.status).toBe(getEventStatus(event.startDate, event.endDate))
    }
    expectSortedByStart(upcomingEvents)
  })

  it('Events page spotlight has not ended and upcoming list is strictly upcoming', async () => {
    const { spotlightEvent, upcomingEvents } = await getEventsData()

    if (spotlightEvent) {
      expect(spotlightEvent.spotlight).toBe(true)
      expect(spotlightEvent.status).not.toBe('past')
    }
    for (const event of upcomingEvents) {
      expect(event.status).toBe('upcoming')
      expect(event.id).not.toBe(spotlightEvent?.id)
    }
    expectSortedByStart(upcomingEvents)
  })
})
