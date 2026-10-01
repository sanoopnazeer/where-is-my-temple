import type { Where } from 'payload'

/*
 * Plain Payload/MongoDB search (docs/architecture.md §12 — no search
 * engine): each searchable field gets a case-insensitive `like` condition
 * and the fields are OR'd. `like` matches every word of the query somewhere
 * in the same field, and Payload escapes regex characters itself.
 */

export const MIN_SEARCH_LENGTH = 2
export const MAX_SEARCH_LENGTH = 100

/** `?q=` as a trimmed, whitespace-collapsed string ('' when absent). */
export function normalizeSearchQuery(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw
  return (value ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_SEARCH_LENGTH).trim()
}

/** Whether a normalized query is long enough to run. */
export function isSearchable(query: string): boolean {
  return query.length >= MIN_SEARCH_LENGTH
}

// Localized fields are searched in both languages (`<field>.ml` targets
// the Malayalam value; the bare path is the default `en` locale).
export const TEMPLE_SEARCH_FIELDS = [
  'name',
  'name.ml',
  'locality',
  'taluk',
  'dailyRituals.name',
  'dailyRituals.name.ml',
]
export const EVENT_SEARCH_FIELDS = ['name', 'keyRitual', 'keywords.keyword']
export const DISTRICT_SEARCH_FIELDS = ['name']

/** `where` matching the query in any of the given fields. */
export function textSearchWhere(fields: string[], query: string): Where {
  return { or: fields.map((field) => ({ [field]: { like: query } })) }
}
