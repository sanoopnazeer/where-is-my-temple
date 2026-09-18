import type { Media } from '@/payload-types'

/**
 * Relationship fields can come back as either a populated Media doc or a
 * bare ID string (e.g. when access control falls back to ID-only). Only
 * the populated shape has a usable URL.
 */
export function resolveMediaUrl(media: (string | Media | null) | undefined): string | undefined {
  if (!media || typeof media === 'string') return undefined
  return media.url ?? undefined
}
