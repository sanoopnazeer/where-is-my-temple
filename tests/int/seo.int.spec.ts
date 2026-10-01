import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getPayload } from 'payload'
import { describe, expect, it } from 'vitest'

import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { JsonLd } from '@/components/seo/JsonLd'
import config from '@/payload.config'
import type { District, Temple } from '@/payload-types'
import { SITE_URL, pageMetadata } from '@/utilities/site'
import { templeJsonLd, websiteJsonLd } from '@/utilities/structuredData'

const district = {
  id: 'd1',
  name: 'Kozhikode',
  slug: 'kozhikode',
  publicationStatus: 'published',
} as District

const temple = {
  id: 't1',
  name: 'Tali Shiva Temple',
  slug: 'tali-shiva-temple',
  district,
  locality: 'Kozhikode Town',
  address: 'Tali, Kozhikode, Kerala',
  latitude: 11.25,
  longitude: 75.78,
  heroImage: { id: 'm1', url: 'https://media.whereismytemple.com/hero.jpg', alt: 'Hero' },
  gallery: [
    { id: 'm2', url: 'https://media.whereismytemple.com/g1.jpg', alt: 'G1' },
    { id: 'm1', url: 'https://media.whereismytemple.com/hero.jpg', alt: 'Hero' },
    'unpopulated-id',
  ],
  contact: { phone: '+91 495 000 0000', website: 'https://example.org/temple', email: null },
  socialLinks: { instagram: '@not-a-url', facebook: 'https://facebook.com/tali', youtube: '' },
} as unknown as Temple

describe('page metadata', () => {
  it('builds canonical, Open Graph and Twitter from one path', () => {
    const metadata = pageMetadata({ title: 'T', description: 'D', path: '/about' })
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/about`)
    expect(metadata.openGraph).toMatchObject({
      url: `${SITE_URL}/about`,
      siteName: 'Where Is My Temple',
    })
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', title: 'T' })
    expect(metadata.robots).toBeUndefined()
    expect(pageMetadata({ title: 'T', path: '/' }).alternates?.canonical).toBe(SITE_URL)
    expect(pageMetadata({ title: 'T', path: '/x', noIndex: true }).robots).toEqual({
      index: false,
      follow: true,
    })
  })
})

type GraphNode = Record<string, unknown> & {
  image?: string[]
  sameAs?: string[]
  itemListElement?: { item: string }[]
}

describe('Temple structured data', () => {
  const [place, breadcrumbs] = templeJsonLd(temple, 'An excerpt.')['@graph'] as GraphNode[]

  it('uses only stored Temple fields', () => {
    expect(place).toMatchObject({
      '@type': 'HinduTemple',
      name: 'Tali Shiva Temple',
      url: `${SITE_URL}/temples/tali-shiva-temple`,
      description: 'An excerpt.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Tali, Kozhikode, Kerala',
        addressLocality: 'Kozhikode Town',
        addressRegion: 'Kerala',
        addressCountry: 'IN',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 11.25, longitude: 75.78 },
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Kozhikode',
        url: `${SITE_URL}/districts/kozhikode`,
      },
      telephone: '+91 495 000 0000',
    })
    // De-duplicated, populated images only
    expect(place.image).toEqual([
      'https://media.whereismytemple.com/hero.jpg',
      'https://media.whereismytemple.com/g1.jpg',
    ])
    // Only real http(s) links; a bare handle and empty values are dropped
    expect(place.sameAs).toEqual(['https://example.org/temple', 'https://facebook.com/tali'])
    expect(place).not.toHaveProperty('email')
  })

  it('emits a Home → Districts → District → Temple breadcrumb', () => {
    expect(breadcrumbs['@type']).toBe('BreadcrumbList')
    expect(breadcrumbs.itemListElement?.map((crumb) => crumb.item)).toEqual([
      SITE_URL,
      `${SITE_URL}/districts`,
      `${SITE_URL}/districts/kozhikode`,
      `${SITE_URL}/temples/tali-shiva-temple`,
    ])
  })

  it('never exposes an unpublished District', () => {
    const draftDistrict = { ...district, publicationStatus: 'draft' } as District
    const graph = templeJsonLd({ ...temple, district: draftDistrict } as Temple)[
      '@graph'
    ] as GraphNode[]
    expect(graph[0]).not.toHaveProperty('containedInPlace')
    expect(JSON.stringify(graph)).not.toContain('/districts/kozhikode')
  })

  it('escapes `<` so CMS text cannot close the script tag', () => {
    const html = renderToStaticMarkup(createElement(JsonLd, { data: { name: '</script><b>x' } }))
    expect(html).not.toContain('</script><b>')
    expect(html).toContain('\\u003c/script>')
  })

  it('describes the site with the real /search route', () => {
    expect(websiteJsonLd()).toMatchObject({
      '@type': 'WebSite',
      url: SITE_URL,
      potentialAction: { target: { urlTemplate: `${SITE_URL}/search?q={search_term_string}` } },
    })
  })
})

describe('robots.txt', () => {
  it('allows public pages and blocks admin/API', () => {
    const result = robots()
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules
    expect(rule.allow).toBe('/')
    expect(rule.disallow).toEqual(expect.arrayContaining(['/admin', '/api']))
    expect(rule.disallow).not.toContain('/temples')
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})

describe('sitemap.xml (read-only, real data)', () => {
  it('lists exactly the public pages and published Districts/Temples', async () => {
    const urls = (await sitemap()).map((entry) => entry.url)

    const payload = await getPayload({ config: await config })
    const all = { pagination: false, limit: 0, depth: 0, overrideAccess: true } as const
    const [districts, temples] = await Promise.all([
      payload.find({ collection: 'districts', ...all }),
      payload.find({ collection: 'temples', ...all }),
    ])

    for (const path of ['', '/about', '/contact', '/districts', '/events']) {
      expect(urls).toContain(`${SITE_URL}${path}`)
    }
    for (const doc of [...districts.docs, ...temples.docs]) {
      const url = `${SITE_URL}/${'district' in doc ? 'temples' : 'districts'}/${doc.slug}`
      if (doc.publicationStatus === 'published') expect(urls).toContain(url)
      else expect(urls).not.toContain(url)
    }
    expect(urls.every((url) => url.startsWith(SITE_URL))).toBe(true)
    expect(urls.some((url) => url.includes('/search') || url.includes('/events/'))).toBe(false)
    expect(new Set(urls).size).toBe(urls.length)
  }, 30_000)
})
