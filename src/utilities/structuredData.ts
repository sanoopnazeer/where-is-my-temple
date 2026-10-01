import type { Temple } from '@/payload-types'

import { resolveMediaUrl } from './media'
import { SITE_NAME, SITE_URL, absoluteUrl } from './site'

/*
 * schema.org JSON-LD built only from fields the CMS actually stores — no
 * invented facts. Empty/missing values are omitted rather than guessed.
 */

type JsonLd = Record<string, unknown>

/** Only absolute http(s) URLs (contact/social fields are free text). */
function asHttpUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

/** Drops undefined/empty values so the output has no blank properties. */
function compact(object: JsonLd): JsonLd {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0),
    ),
  )
}

/** Site-level `WebSite` for the Home page, with the real `/search` route. */
export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Temple Detail page: a schema.org `HinduTemple` (a `PlaceOfWorship`) plus
 * its Home → Districts → District → Temple `BreadcrumbList`, in one `@graph`. Every
 * Temple belongs to a Kerala District (the platform's fixed scope,
 * CLAUDE.md §1), which is the only non-field value used (address region
 * and country).
 */
export function templeJsonLd(temple: Temple, description?: string): JsonLd {
  const url = absoluteUrl(`/temples/${temple.slug}`)
  const district =
    typeof temple.district === 'object' && temple.district?.publicationStatus === 'published'
      ? temple.district
      : undefined
  const districtUrl = district ? absoluteUrl(`/districts/${district.slug}`) : undefined

  const images = [temple.heroImage, ...(temple.gallery ?? [])]
    .map((media) => resolveMediaUrl(media))
    .filter((image): image is string => Boolean(image))

  const sameAs = [
    temple.contact?.website,
    temple.socialLinks?.instagram,
    temple.socialLinks?.facebook,
    temple.socialLinks?.youtube,
  ]
    .map(asHttpUrl)
    .filter((link): link is string => Boolean(link))

  const place = compact({
    '@type': 'HinduTemple',
    '@id': `${url}#temple`,
    name: temple.name,
    url,
    description,
    image: [...new Set(images)],
    address: compact({
      '@type': 'PostalAddress',
      streetAddress: temple.address,
      addressLocality: temple.locality ?? undefined,
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    }),
    geo: { '@type': 'GeoCoordinates', latitude: temple.latitude, longitude: temple.longitude },
    containedInPlace: district
      ? { '@type': 'AdministrativeArea', name: district.name, url: districtUrl }
      : undefined,
    telephone: temple.contact?.phone ?? undefined,
    email: temple.contact?.email ?? undefined,
    sameAs: [...new Set(sameAs)],
  })

  const crumbs = [
    { name: 'Home', item: SITE_URL },
    { name: 'Districts', item: absoluteUrl('/districts') },
    ...(district ? [{ name: district.name, item: districtUrl }] : []),
    { name: temple.name, item: url },
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      place,
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
    ],
  }
}
