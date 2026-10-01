import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Event, Temple } from '@/payload-types'
import { notEndedEventsWhere, upcomingEventsWhere } from '@/utilities/eventDate'

const MAX_UPCOMING_EVENTS = 12

/** An Event whose linked Temple is confirmed populated and published —
 * the only shape these components ever render (see `hasPublicTemple`). */
export type PublicEvent = Event & { temple: Temple }

export interface EventsData {
  spotlightEvent?: PublicEvent
  upcomingEvents: PublicEvent[]
}

/**
 * An Event's `temple` is populated (`depth: 2`, so `temple.district` also
 * resolves) via the Local API's own `overrideAccess: false`, but that
 * doesn't guarantee the *populated* Temple document itself was
 * access-checked the same way a direct `find` would be. Rather than rely
 * on that, every event here is defensively re-checked in memory: if its
 * linked Temple isn't a populated, `published` document, the event is
 * dropped rather than shown with missing/unverified venue info — this is
 * the only way an Event's page ever shows Temple-derived data (name,
 * locality, District via Temple → District), so this one check protects
 * all of it.
 */
export function hasPublicTemple(event: Event): event is PublicEvent {
  return (
    typeof event.temple === 'object' &&
    event.temple !== null &&
    event.temple.publicationStatus === 'published'
  )
}

/**
 * Events & Festivals page data in two Local API calls total (not one per
 * card): the spotlighted Event (`spotlight: true`, existing field — no new
 * ranking mechanism) that hasn't fully ended yet, and the next batch of
 * upcoming Events. Both use `overrideAccess: false` with no `user`,
 * applying the same public `publishedOrAdmin` rule the REST API uses, so
 * draft/review/archived Events are excluded automatically. "Not ended" and
 * "upcoming" come from `src/utilities/eventDate.ts` — the query form of the
 * same whole-IST-day definition the Event collection's virtual `status`
 * field uses, not a second, divergent one (virtual fields aren't queryable). No
 * `isUpcoming` field, no District field on Events — District is always
 * read via the populated `temple.district`.
 */
export async function getEventsData(): Promise<EventsData> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const now = new Date()

  const [spotlightResult, upcomingResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        spotlight: { equals: true },
        ...notEndedEventsWhere(now),
      },
      sort: 'startDate',
      limit: 1,
      depth: 2,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'events',
      where: upcomingEventsWhere(now),
      sort: 'startDate',
      limit: MAX_UPCOMING_EVENTS,
      depth: 2,
      overrideAccess: false,
    }),
  ])

  const spotlightEvent = spotlightResult.docs.find(hasPublicTemple)

  const upcomingEvents = upcomingResult.docs
    .filter(hasPublicTemple)
    .filter((event) => event.id !== spotlightEvent?.id)

  return { spotlightEvent, upcomingEvents }
}
