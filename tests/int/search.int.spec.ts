import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import {
  getDistrictTemples,
  getDistrictTemplesMeta,
  searchDistrictEvents,
} from '@/app/(frontend)/districts/[slug]/getDistrictTemples'
import { getSearchResults } from '@/app/(frontend)/search/getSearchResults'
import type { District } from '@/payload-types'
import { getEventStatus } from '@/utilities/eventDate'
import {
  MAX_SEARCH_LENGTH,
  TEMPLE_SEARCH_FIELDS,
  isSearchable,
  normalizeSearchQuery,
  textSearchWhere,
} from '@/utilities/search'

describe('search query helpers', () => {
  it('normalizes ?q= values', () => {
    expect(normalizeSearchQuery(undefined)).toBe('')
    expect(normalizeSearchQuery('  Guruvayur   Krishna  ')).toBe('Guruvayur Krishna')
    expect(normalizeSearchQuery(['first', 'second'])).toBe('first')
    expect(normalizeSearchQuery('x'.repeat(500))).toHaveLength(MAX_SEARCH_LENGTH)
  })

  it('requires at least two characters', () => {
    expect(isSearchable('')).toBe(false)
    expect(isSearchable('a')).toBe(false)
    expect(isSearchable('ab')).toBe(true)
  })

  it('ORs a case-insensitive `like` across the given fields', () => {
    expect(textSearchWhere(['name', 'name.ml'], 'tali')).toEqual({
      or: [{ name: { like: 'tali' } }, { 'name.ml': { like: 'tali' } }],
    })
    expect(TEMPLE_SEARCH_FIELDS).toEqual(
      expect.arrayContaining(['name', 'name.ml', 'dailyRituals.name']),
    )
  })
})

/*
 * Read-only checks against the configured database. They assert invariants
 * that hold for any content: every result is public, Events are ongoing or
 * upcoming at a published Temple, and district search never leaves its
 * District. Nothing is created or changed.
 */
const QUERIES = ['te', 'temple', 'test', 'festival', 'pooja']

// Several sequential Atlas round-trips per test
const DB_TIMEOUT = 30_000

describe('site-wide search (/search)', () => {
  it(
    'returns only published, matching-type records',
    async () => {
      for (const query of QUERIES) {
        const results = await getSearchResults(query)

        for (const temple of results.temples) expect(temple.publicationStatus).toBe('published')
        for (const district of results.districts)
          expect(district.publicationStatus).toBe('published')
        for (const event of results.events) {
          expect(event.publicationStatus).toBe('published')
          expect(event.temple.publicationStatus).toBe('published')
          expect(getEventStatus(event.startDate, event.endDate)).not.toBe('past')
        }
      }
    },
    DB_TIMEOUT,
  )

  it('matches nothing for text no record contains', async () => {
    const results = await getSearchResults('zz-no-such-temple-zz')
    expect(results.temples).toHaveLength(0)
    expect(results.events).toHaveLength(0)
    expect(results.districts).toHaveLength(0)
  })
})

describe('district-scoped search (/districts/[slug]?q=)', () => {
  let districts: District[] = []

  beforeAll(async () => {
    const payload = await getPayload({ config: await config })
    const result = await payload.find({
      collection: 'districts',
      limit: 100,
      overrideAccess: false,
    })
    districts = result.docs
  })

  it(
    'only returns Temples and Events belonging to that District',
    async () => {
      expect(districts.length).toBeGreaterThan(0)

      for (const district of districts) {
        const { templeIds } = await getDistrictTemplesMeta(district.id)

        for (const query of QUERIES) {
          const { temples } = await getDistrictTemples(district.id, 1, query)
          for (const temple of temples) {
            const districtId =
              typeof temple.district === 'object' ? temple.district.id : temple.district
            expect(districtId).toBe(district.id)
            expect(temple.publicationStatus).toBe('published')
          }

          const events = await searchDistrictEvents(templeIds, query)
          for (const event of events) {
            expect(templeIds).toContain(event.temple.id)
            expect(getEventStatus(event.startDate, event.endDate)).not.toBe('past')
          }
        }
      }
    },
    DB_TIMEOUT,
  )

  it(
    'without a query lists the same Temples as before',
    async () => {
      for (const district of districts) {
        const unfiltered = await getDistrictTemples(district.id, 1)
        const emptyQuery = await getDistrictTemples(district.id, 1, '')
        expect(emptyQuery.temples.map((t) => t.id)).toEqual(unfiltered.temples.map((t) => t.id))
      }
    },
    DB_TIMEOUT,
  )
})
