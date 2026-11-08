import type { Temple } from '@/payload-types'
import { formatIstTimeShort, istHour } from '@/utilities/ist'
import { TRANSIT_TYPES, type TransitType } from '@/utilities/transitTypes'

/*
 * Display data derived from a Temple, shared by the mobile and desktop Temple
 * pages so both lay out exactly the same content. Nothing is invented: every
 * list only contains entries that have the text/times the design shows.
 */

export type HighlightIcon = NonNullable<
  NonNullable<Temple['spiritualHighlights']>[number]['icon']
>
export type TransitKind = 'train' | 'air' | 'road'

export function hasText(value: string | null | undefined): value is string {
  return Boolean(value && value.trim())
}

/** Paragraphs of a textarea, separated by blank lines. */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
}

/** "5:00 AM", or "5:00 AM – 11:00 AM" with an end time; null without a start. */
export function timeRange(start?: string | null, end?: string | null): string | null {
  if (!start) return null
  return end ? `${formatIstTimeShort(start)} – ${formatIstTimeShort(end)}` : formatIstTimeShort(start)
}

const TRANSIT_KINDS: Record<TransitType, TransitKind> = {
  road: 'road',
  bus: 'road',
  rail: 'train',
  metro: 'train',
  air: 'air',
}

type TransitPoint = NonNullable<Temple['transitPoints']>[number]

/** "By Rail (2 km)" / "റെയിൽ മാർഗ്ഗം (2 km)"; the heading alone without a distance. */
function transitHeading(point: TransitPoint, locale: 'en' | 'ml'): string {
  const label = TRANSIT_TYPES.find((type) => type.value === point.type)?.heading[locale] ?? ''
  return typeof point.distance === 'number'
    ? `${label} (${Number(point.distance.toFixed(2))} ${point.unit ?? 'km'})`
    : label
}

export function buildTempleView(temple: Temple, locale: 'en' | 'ml' = 'en') {
  const darshan = (temple.darshanTimings ?? []).flatMap((timing, index) => {
    const time = timeRange(timing.openTime, timing.closeTime)
    return time && timing.openTime
      ? [{ id: timing.id ?? String(index), label: timing.label ?? '', time, isMorning: istHour(timing.openTime) < 12 }]
      : []
  })

  const rituals = (temple.dailyRituals ?? []).flatMap((ritual, index) =>
    hasText(ritual.name)
      ? [{ id: ritual.id ?? String(index), name: ritual.name, time: timeRange(ritual.startTime, ritual.endTime) }]
      : [],
  )

  const guidelines: { id: string; title?: string | null; text: string }[] = []
  const { men, women } = temple.dressCode ?? {}
  if (hasText(men) || hasText(women)) {
    guidelines.push({
      id: 'dress-code',
      title: 'Dress Code',
      text: [hasText(men) ? `Men: ${men}` : '', hasText(women) ? `Women: ${women}` : '']
        .filter(Boolean)
        .join(' '),
    })
  }
  ;(temple.importantRules ?? []).forEach((rule, index) => {
    if (hasText(rule.rule)) {
      guidelines.push({ id: rule.id ?? String(index), title: rule.title, text: rule.rule })
    }
  })

  // Only transit types that have a description are shown.
  const transit = (temple.transitPoints ?? []).flatMap((point, index) =>
    point.type && hasText(point.description)
      ? [
          {
            id: point.id ?? String(index),
            kind: TRANSIT_KINDS[point.type],
            heading: transitHeading(point, locale),
            text: point.description,
          },
        ]
      : [],
  )

  const hasCoordinates =
    typeof temple.latitude === 'number' && typeof temple.longitude === 'number'
  const query = hasCoordinates ? `${temple.latitude},${temple.longitude}` : undefined

  const significance = paragraphs(temple.spiritualSignificance)

  return {
    darshan,
    advisory: hasText(temple.advisory) ? temple.advisory : undefined,
    rituals,
    ritualNote: hasText(temple.ritualNote) ? temple.ritualNote : undefined,
    significance,
    hasSpiritualDetails:
      hasText(temple.presidingDeity) || hasText(temple.sacredLocation) || significance.length > 0,
    highlights: (temple.spiritualHighlights ?? []).filter((item) => hasText(item.title)),
    festivals: (temple.festivals ?? []).filter((item) => hasText(item.name)),
    guidelines,
    transit,
    hasReach: Boolean(temple.howToReach) || hasText(temple.address) || transit.length > 0,
    hasDirection: hasCoordinates || hasText(temple.directionNote),
    directionsUrl: query ? `https://www.google.com/maps/dir/?api=1&destination=${query}` : undefined,
    mapsUrl: query ? `https://www.google.com/maps/search/?api=1&query=${query}` : undefined,
  }
}

export type TempleView = ReturnType<typeof buildTempleView>

export type ContactKind =
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'website'
  | 'instagram'
  | 'facebook'
  | 'youtube'
export type ContactLink = { kind: ContactKind; label: string; value: string; href: string }

function webUrl(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

/** Contact and social entries the Temple actually has, in display order. */
export function buildContactLinks(temple: Temple): ContactLink[] {
  const { contact, socialLinks } = temple
  const links: ContactLink[] = []
  const add = (
    kind: ContactKind,
    label: string,
    raw: string | null | undefined,
    href: (value: string) => string,
  ) => {
    if (hasText(raw)) links.push({ kind, label, value: raw.trim(), href: href(raw.trim()) })
  }
  add('phone', 'Phone', contact?.phone, (v) => `tel:${v.replace(/[^\d+]/g, '')}`)
  add('whatsapp', 'WhatsApp', contact?.whatsapp, (v) => `https://wa.me/${v.replace(/\D/g, '')}`)
  add('email', 'Email', contact?.email, (v) => `mailto:${v}`)
  add('website', 'Website', contact?.website, webUrl)
  add('instagram', 'Instagram', socialLinks?.instagram, webUrl)
  add('facebook', 'Facebook', socialLinks?.facebook, webUrl)
  add('youtube', 'YouTube', socialLinks?.youtube, webUrl)
  return links
}
