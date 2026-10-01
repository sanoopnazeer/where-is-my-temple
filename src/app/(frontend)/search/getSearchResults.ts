import { getPayload } from 'payload'

import config from '@/payload.config'
import type { District, Temple } from '@/payload-types'
import { hasPublicTemple, type PublicEvent } from '@/app/(frontend)/events/getEventsData'
import { notEndedEventsWhere } from '@/utilities/eventDate'
import {
  DISTRICT_SEARCH_FIELDS,
  EVENT_SEARCH_FIELDS,
  TEMPLE_SEARCH_FIELDS,
  textSearchWhere,
} from '@/utilities/search'

export const MAX_TEMPLE_RESULTS = 12
export const MAX_EVENT_RESULTS = 6
export const MAX_DISTRICT_RESULTS = 6

export interface SearchResults {
  temples: Temple[]
  templeTotal: number
  events: PublicEvent[]
  eventTotal: number
  districts: District[]
  districtTotal: number
}

/**
 * Site-wide search (Home search → `/search?q=`): Temples, ongoing/upcoming
 * Events and Districts matching `query`, as three concurrent Local API
 * queries with small limits. `overrideAccess: false` with no `user` applies
 * the public `publishedOrAdmin` rule to each collection, so only published
 * records can match. Events are additionally restricted (in the query and
 * again in memory) to ones whose linked Temple is published.
 */
export async function getSearchResults(query: string): Promise<SearchResults> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [templesResult, eventsResult, districtsResult] = await Promise.all([
    payload.find({
      collection: 'temples',
      where: textSearchWhere(TEMPLE_SEARCH_FIELDS, query),
      sort: 'name',
      limit: MAX_TEMPLE_RESULTS,
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'events',
      where: {
        and: [
          notEndedEventsWhere(),
          { 'temple.publicationStatus': { equals: 'published' } },
          textSearchWhere(EVENT_SEARCH_FIELDS, query),
        ],
      },
      sort: 'startDate',
      limit: MAX_EVENT_RESULTS,
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'districts',
      where: textSearchWhere(DISTRICT_SEARCH_FIELDS, query),
      sort: 'name',
      limit: MAX_DISTRICT_RESULTS,
      overrideAccess: false,
    }),
  ])

  return {
    temples: templesResult.docs,
    templeTotal: templesResult.totalDocs,
    events: eventsResult.docs.filter(hasPublicTemple),
    eventTotal: eventsResult.totalDocs,
    districts: districtsResult.docs,
    districtTotal: districtsResult.totalDocs,
  }
}
